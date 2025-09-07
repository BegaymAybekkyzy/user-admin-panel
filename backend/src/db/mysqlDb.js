import mysql from 'mysql2/promise';
import config from '../../config.js';

let pool;

const mysqlDb = {
  async init() {
    pool = mysql.createPool({
      host: config.db.host,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    const conn = await pool.getConnection();
    console.log('MySQL connected');
    conn.release();
  },

  async getConnection() {
    if (!pool) {
      throw new Error('MySQL not initialized. Call mysqlDb.init() first.');
    }
    return pool;
  },
};

export default mysqlDb;
