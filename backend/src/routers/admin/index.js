import express from 'express';
import usersManagementRouter from './usersManagement.js';
import { authMiddleware } from '../../middleware/auth.js';
import users from './users.js';

const adminRouter = express.Router();

adminRouter.use('/users-management', authMiddleware, usersManagementRouter);
adminRouter.use('/users', authMiddleware, users);

export default adminRouter;
