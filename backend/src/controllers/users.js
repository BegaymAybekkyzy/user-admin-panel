import jwt from 'jsonwebtoken';
import config, { REFRESH_EXPIRES_IN_DAYS } from '../../config.js';
import mysqlDb from '../db/mysqlDb.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { validateBirthdate } from '../utils/validateDate.js';

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).send({ error: 'Username and password required' });
      return;
    }

    const pool = await mysqlDb.getConnection();

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ? LIMIT 1',
      [username],
    );

    if (rows.length === 0) {
      res.status(401).send({ error: 'Invalid credentials' });
      return;
    }

    const user = rows[0];

    const isMatch = await verifyPassword(user.password, password);
    if (!isMatch) {
      res.status(401).send({ error: 'Invalid credentials' });
      return;
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: REFRESH_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000,
    });

    await pool.query(
      'UPDATE users SET refresh_token = ?, refresh_expires_at = DATE_ADD(NOW(), INTERVAL ? DAY) WHERE id = ?',
      [refreshToken, REFRESH_EXPIRES_IN_DAYS, user.id],
    );

    const safeUser = {
      role: user.role,
      first_name: user.first_name,
    };
    res.send({ user: safeUser, accessToken });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(401).send({ error: 'No refresh token provided' });
      return;
    }

    const pool = await mysqlDb.getConnection();
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE refresh_token = ? AND refresh_expires_at > NOW() LIMIT 1',
      [refreshToken],
    );

    if (rows.length === 0) {
      res.status(401).send({ error: 'Invalid or expired refresh token' });
      return;
    }

    const user = rows[0];
    try {
      jwt.verify(refreshToken, config.jwt.refreshSecret);
    } catch {
      res.status(401).send({ error: 'Invalid refresh token' });
      return;
    }

    const newAccessToken = generateAccessToken(user);

    res.send({ accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'strict',
    });

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.send({ message: 'You have successfully logged out of the system.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.send({ message: 'You have successfully logged out of the system.' });
      return;
    }

    let payload;
    try {
      payload = jwt.verify(token, config.jwt.accessSecret);
    } catch {
      res.send({ message: 'You have successfully logged out of the system.' });
      return;
    }

    const pool = await mysqlDb.getConnection();
    await pool.query(
      'UPDATE users SET refresh_token = NULL, refresh_expires_at = NULL WHERE id = ?',
      [payload.id],
    );

    res.send({ message: 'You have successfully logged out of the system.' });
  } catch (error) {
    next(error);
  }
};

export const updateUserSelf = async (req, res, next) => {
  try {
    const id = parseInt(req.user.id, 10);
    const {
      firstName,
      lastName,
      gender,
      birthdate,
      username,
      password,
      currentPassword,
    } = req.body;

    const pool = await mysqlDb.getConnection();
    const [existing] = await pool.query(
      'SELECT id, password FROM users WHERE id = ? LIMIT 1',
      [id],
    );

    if (existing.length === 0) {
      res.status(404).send({ error: 'User not found' });
      return;
    }

    const user = existing[0];

    let passwordHash = null;
    if (password) {
      if (!currentPassword) {
        res
          .status(400)
          .send({ error: 'Current password is required to change password' });
        return;
      }

      const isMatch = await verifyPassword(currentPassword, user.password);
      if (!isMatch) {
        res.status(403).send({ error: 'Current password is incorrect' });
        return;
      }

      passwordHash = await hashPassword(password);
    }

    let safeBirthdate = null;
    if (birthdate) {
      try {
        safeBirthdate = validateBirthdate(birthdate);
      } catch (err) {
        return res.status(400).send({ error: err.message });
      }
    }

    await pool.query(
      `UPDATE users
         SET first_name = COALESCE(?, first_name),
             last_name = COALESCE(?, last_name),
             gender = COALESCE(?, gender),
             birthdate = COALESCE(?, birthdate),
             username = COALESCE(?, username),
             password = COALESCE(?, password)
         WHERE id = ?`,
      [
        firstName || null,
        lastName || null,
        gender || null,
        safeBirthdate || null,
        username || null,
        passwordHash || null,
        id,
      ],
    );

    res.send({ message: 'Profile updated' });
  } catch (error) {
    next(error);
  }
};

export const deleteUserSelf = async (req, res, next) => {
  try {
    const id = req.user.id;
    const { currentPassword } = req.body;

    const pool = await mysqlDb.getConnection();
    const [rows] = await pool.query(
      'SELECT id, role, password FROM users WHERE id = ? LIMIT 1',
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).send({ error: 'User not found' });
    }

    const user = rows[0];

    if (!currentPassword) {
      return res
        .status(400)
        .send({ error: 'Current password is required to delete account' });
    }

    const isMatch = await verifyPassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(403).send({ error: 'Current password is incorrect' });
    }

    if (user.role === 'admin') {
      const [countAdmins] = await pool.query(
        'SELECT COUNT(*) as adminsCount FROM users WHERE role = "admin"',
      );

      if (countAdmins[0].adminsCount <= 1) {
        return res
          .status(400)
          .send({ error: 'You cannot delete the last admin account' });
      }
    }

    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.send({ message: 'Your account has been deleted' });
  } catch (error) {
    next(error);
  }
};
