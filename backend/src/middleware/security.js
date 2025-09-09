import helmet from 'helmet';
import { xss } from 'express-xss-sanitizer';
import rateLimit from 'express-rate-limit';
import express from 'express';

const security = express.Router();

security.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  }),
);

security.use(xss());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts, try again later' },
});

security.use('/users/login', authLimiter);

security.use((req, res, next) => {
  if (req.method === 'GET') {
    res.cookie('XSRF-TOKEN', req.csrfToken?.(), {
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
  }
  next();
});

export default security;
