import express from 'express';
import {
  getDashboardStats,
  getMatchScoreInsights
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Dashboard routes
router.get('/', getDashboardStats);
router.get('/insights', getMatchScoreInsights);

export default router;


