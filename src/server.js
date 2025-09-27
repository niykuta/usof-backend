import express from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';
import { mainRouter } from '#src/routes/main.router.js';
import { adminRouter } from '#src/routes/admin.router.js';
import { requireAdmin } from '#src/middlewares/auth.middleware.js';
import { errorHandler } from '#src/middlewares/error.middleware.js';
import AdminJSExpress from '@adminjs/express';
import createAdminJS from '#src/config/adminjs.config.js';

async function startServer() {
  const app = express();
  const port = 3000;

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use('/uploads', express.static('uploads'));
  app.use(express.static('public'));

  try {
    const admin = await createAdminJS();
    const adminJSRouter = AdminJSExpress.buildRouter(admin);
    app.use(admin.options.rootPath, requireAdmin, adminJSRouter);
    console.log('AdminJS initialized successfully');
  } catch (error) {
    console.error('Failed to initialize AdminJS:', error);
    console.log('Continuing without AdminJS...');
  }

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.use('/api', mainRouter);
  app.use('/api/admin', adminRouter);
  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Admin panel available at http://localhost:${port}/admin`);
  });
}

startServer().catch(console.error);
