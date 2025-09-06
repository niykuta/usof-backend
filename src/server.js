import express from 'express';
import { mainRouter } from './routes/main.router.js';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/', mainRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
