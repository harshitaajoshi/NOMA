import express from 'express';
import {
  addToTracker,
  getUserTrackedInternships,
  getTrackedInternshipById,
  updateTrackerStatus,
  removeFromTracker,
  getUpcomingReminders
} from '../controllers/trackerController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Tracker routes
router.post('/', addToTracker);
router.get('/', getUserTrackedInternships);
router.get('/reminders/upcoming', getUpcomingReminders);
router.get('/:id', getTrackedInternshipById);
router.patch('/:id', updateTrackerStatus);
router.delete('/:id', removeFromTracker);

export default router;


