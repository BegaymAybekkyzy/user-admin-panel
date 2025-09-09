import express from 'express';
import {
  addUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from '../../controllers/usersManagement.js';

const usersManagementRouter = express.Router();

usersManagementRouter.get('/', getUsers);
usersManagementRouter.get('/:id', getUserById);
usersManagementRouter.post('/add-user', addUser);
usersManagementRouter.put('/update-user/:id', updateUser);
usersManagementRouter.delete('/:id', deleteUser);

export default usersManagementRouter;
