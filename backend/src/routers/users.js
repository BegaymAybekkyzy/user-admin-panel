import express from 'express';
import { login, logout, refresh } from '../controllers/users.js';

const userRouter = express.Router();

userRouter.post('/login', login);
userRouter.delete('/logout', logout);
userRouter.delete('/refresh', refresh);

export default userRouter;
