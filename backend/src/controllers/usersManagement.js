import mysqlDb from '../db/mysqlDb.js';
import { hashPassword } from '../utils/password.js';
import { validateBirthdate } from '../utils/validateDate.js';

export const getUsers = async (req, res, next) => {
  try {
    const pool = await mysqlDb.getConnection();
    const {
      page = 1,
      limit = 10,
      username,
      firstName,
      birthdate,
      sortBy = 'first_name',
      order = 'asc',
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const offset = (pageNum - 1) * limitNum;

    let where = 'WHERE role != "admin"';
    const params = [];

    if (username) {
      where += ' AND username LIKE ?';
      params.push(`%${username}%`);
    }
    if (firstName) {
      where += ' AND first_name LIKE ?';
      params.push(`%${firstName}%`);
    }
    if (birthdate) {
      where += ' AND birthdate = ?';
      params.push(birthdate);
    }

    const allowedSortFields = ['username', 'first_name', 'birthdate'];
    const allowedOrders = ['asc', 'desc'];

    const sortField = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'first_name';
    const sortOrder = allowedOrders.includes(order.toLowerCase())
      ? order.toUpperCase()
      : 'ASC';

    const [rows] = await pool.query(
      `SELECT id, username, first_name, birthdate
           FROM users
                    ${where}
           ORDER BY ${sortField} ${sortOrder}
       LIMIT ? OFFSET ?`,
      [...params, limitNum, offset],
    );

    const [countRows] = await pool.query(
      `SELECT COUNT(*) as total FROM users ${where}`,
      params,
    );

    res.send({
      data: rows,
      pagination: {
        total: countRows[0].total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(countRows[0].total / limitNum),
      },
      sort: {
        sortBy: sortField,
        order: sortOrder,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const pool = await mysqlDb.getConnection();

    const [rows] = await pool.query(
      'SELECT id, username, first_name, last_name, role FROM users WHERE id = ? LIMIT 1',
      [id],
    );

    if (rows.length === 0) {
      res.status(404).send({ error: 'User not found' });
      return;
    }

    res.send(rows[0]);
  } catch (err) {
    next(err);
  }
};

export const addUser = async (req, res, next) => {
  try {
    const { username, password, firstName, lastName, gender, birthdate } =
      req.body;

    if (!username || !password || !firstName) {
      res
        .status(400)
        .send({ error: 'Username, password and first name required' });
      return;
    }
    const pool = await mysqlDb.getConnection();

    const [rows] = await pool.query(
      'SELECT id FROM users WHERE username = ? LIMIT 1',
      [username],
    );

    if (rows.length > 0) {
      res.status(400).send({ error: 'Username already taken' });
      return;
    }

    if (birthdate) {
      try {
        validateBirthdate(birthdate);
      } catch (err) {
        return res.status(400).send({ error: err.message });
      }
    }

    const allowedGenders = ['male', 'female', null];
    if (!allowedGenders.includes(gender)) {
      res.status(400).send({ error: 'Gender must be male, female or null' });
      return;
    }

    const hash = await hashPassword(password);
    await pool.query(
      `INSERT INTO users (username, password, first_name, last_name, gender, birthdate, role)
       VALUES (?, ?, ?, ?, ?, ?, 'user')`,
      [
        username,
        hash,
        firstName,
        lastName || null,
        gender || null,
        birthdate || null,
      ],
    );

    res.send({ message: 'User added' });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { firstName, lastName, gender, birthdate, role, username, password } =
      req.body;

    const pool = await mysqlDb.getConnection();

    const [existing] = await pool.query(
      'SELECT id, role FROM users WHERE id = ? LIMIT 1',
      [id],
    );

    if (existing.length === 0) {
      return res.status(404).send({ error: 'User not found' });
    }

    const targetRole = existing[0].role;

    if (targetRole === 'admin') {
      return res.status(403).send({ error: 'You cannot modify another admin' });
    }

    if (username !== undefined || password !== undefined) {
      return res
        .status(400)
        .send({ error: 'Username and password cannot be changed' });
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
           role = COALESCE(?, role)
       WHERE id = ?`,
      [
        firstName || null,
        lastName || null,
        gender || null,
        safeBirthdate,
        role || null,
        id,
      ],
    );

    res.send({ message: 'User updated' });
  } catch (error) {
    next(error);
  }
};

export const updateUserSelf = async (req, res, next) => {
  try {
    const id = parseInt(req.user.id, 10);
    const { firstName, lastName, gender, birthdate, username, password } =
      req.body;

    const pool = await mysqlDb.getConnection();

    const [existing] = await pool.query(
      'SELECT id, role FROM users WHERE id = ? LIMIT 1',
      [id],
    );

    if (existing.length === 0) {
      return res.status(404).send({ error: 'User not found' });
    }
    let safeBirthdate = null;
    if (birthdate) {
      try {
        safeBirthdate = validateBirthdate(birthdate);
      } catch (err) {
        return res.status(400).send({ error: err.message });
      }
    }

    let passwordHash = null;
    if (password) {
      passwordHash = await hashPassword(password);
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
        username || null,
        passwordHash || null,
        id,
        safeBirthdate,
      ],
    );

    res.send({ message: 'Profile updated' });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const currentUser = req.user;

    const pool = await mysqlDb.getConnection();
    const [target] = await pool.query(
      'SELECT id, role FROM users WHERE id = ? LIMIT 1',
      [id],
    );

    if (target.length === 0) {
      return res.status(404).send({ error: 'User not found' });
    }

    const targetUser = target[0];
    if (targetUser.role === 'admin' && targetUser.id !== currentUser.id) {
      return res.status(403).send({ error: 'You cannot delete another admin' });
    }

    if (targetUser.role === 'admin' && targetUser.id === currentUser.id) {
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
    res.send({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};
