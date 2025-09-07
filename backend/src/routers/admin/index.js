import express from 'express';
import usersManagementRouter from './usersManagement.js';
import { authMiddleware } from '../../middleware/auth.js';

const adminRouter = express.Router();

adminRouter.use('/users-management', authMiddleware, usersManagementRouter);

export default adminRouter;
