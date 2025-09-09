import express from 'express';
import { deleteUserSelf, updateUserSelf } from '../../controllers/users.js';

const usersRouter = express.Router();

usersRouter.put('/me', updateUserSelf);
usersRouter.delete('/me', deleteUserSelf);

export default usersRouter;
