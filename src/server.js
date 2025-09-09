import express from 'express';
import { mainRouter } from '#src/routes/main.router.js';
import { errorHandler } from '#src/middlewares/error.middleware.js';
''
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api', mainRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
