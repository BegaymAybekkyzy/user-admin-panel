import jwt from 'jsonwebtoken';
import config from '../../config.js';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).send({ error: 'Unauthorized' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const user = jwt.verify(token, config.jwt.accessSecret);

    if (!user) {
      res.status(401).send({ error: 'User not found' });
      return;
    }

    if (user.role !== 'admin') {
      res.status(403).send({ error: 'Unauthorized' });
      return;
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Invalid or expired token', err });
  }
};
