import express from 'express';
import mysqlDb from './src/db/mysqlDb.js';
import cors from 'cors';
import userRouter from './src/routers/users.js';
import adminRouter from './src/routers/admin/index.js';
import cookieParser from 'cookie-parser';
import security from './src/middleware/security.js';

const app = express();
const port = 8000;

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:4173',
    ],
    credentials: true,
  }),
);

app.use(security);
app.use(cookieParser());
app.use(express.json());
app.use('/users', userRouter);
app.use('/admins', adminRouter);

const run = async () => {
  await mysqlDb.init();

  app.listen(port, () => {
    console.log(`Server started http://localhost:${port}`);
  });
};

run().catch((err) => console.log(err));
