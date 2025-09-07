export const REFRESH_EXPIRES_IN_DAYS = 7;

const config = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: 'admin_panel',
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'default_access_secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
    accessExpiresIn: '15m',
    refreshExpiresIn: `${REFRESH_EXPIRES_IN_DAYS}d`,
  },
};

export default config;
