import jwt from 'jsonwebtoken';
import config, { REFRESH_EXPIRES_IN_DAYS } from '../../config.js';
import mysqlDb from '../db/mysqlDb.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';
import { verifyPassword } from '../utils/password.js';

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
      id: user.id,
      username: user.username,
    };
    res.json({ user: safeUser, accessToken });
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
