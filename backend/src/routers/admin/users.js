import express from 'express';
import {
  deleteUserSelf,
  getUserSelf,
  updateUserSelf,
} from '../../controllers/users.js';

const usersRouter = express.Router();

usersRouter.get('/me', getUserSelf);
usersRouter.put('/me', updateUserSelf);
usersRouter.delete('/me', deleteUserSelf);

export default usersRouter;
