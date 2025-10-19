import express from 'express';
import {
  tweakResumeForJob,
  getQuickScore,
  getTweakedResumes,
  getTweakedResumeById,
  deleteTweakedResume
} from '../controllers/tweakController.js';
import {
  downloadTweakedResumePDF,
  previewTweakedResumePDF
} from '../controllers/pdfController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Tweak routes
router.post('/', tweakResumeForJob);
router.post('/quick-score', getQuickScore);
router.get('/', getTweakedResumes);
router.get('/:id/download', downloadTweakedResumePDF);
router.get('/:id/preview', previewTweakedResumePDF);
router.get('/:id', getTweakedResumeById);
router.delete('/:id', deleteTweakedResume);

export default router;

