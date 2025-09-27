import { Router } from 'express';
import { requireAdmin } from '../middlewares/auth.middleware.js';
import {
  getDashboardStats
} from '../controllers/admin.controller.js';

const adminRouter = Router();

adminRouter.get('/stats', requireAdmin, getDashboardStats);

export { adminRouter };