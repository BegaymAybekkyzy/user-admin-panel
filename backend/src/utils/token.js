import jwt from 'jsonwebtoken';
import config from '../../config.js';

export const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn,
  });
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
};
