import express from 'express';
import mysqlDb from './db/mysqlDb.js';
import cors from 'cors';
import userRouter from './routers/users.js';

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use('/users', userRouter);

const run = async () => {
  await mysqlDb.init();

  app.listen(port, () => {
    console.log(`Server started http://localhost:${port}`);
  });
};

run().catch((err) => console.log(err));
