import express from 'express';
import { login, logout } from '../controllers/users.js';

const userRouter = express.Router();

userRouter.post('/login', login);
userRouter.delete('/logout', logout);

export default userRouter;
