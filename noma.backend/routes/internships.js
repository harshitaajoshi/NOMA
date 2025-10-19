import express from 'express';
import {
  getAllInternships,
  searchInternships,
  getInternshipById,
  refreshInternships,
  getInternshipStats
} from '../controllers/internshipController.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/', getAllInternships);
router.get('/search', searchInternships);
router.get('/stats', getInternshipStats);
router.get('/:id', getInternshipById);

// Refresh route (for MVP, keep public; in production, protect with admin middleware)
router.post('/refresh', refreshInternships);

export default router;


