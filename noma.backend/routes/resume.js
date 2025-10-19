import express from 'express';
import {
  uploadResume,
  getResumes,
  getResumeById,
  deleteResume
} from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../utils/fileUpload.js';

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

// Resume routes
router.post('/upload', upload.single('resume'), uploadResume);
router.get('/', getResumes);
router.get('/:id', getResumeById);
router.delete('/:id', deleteResume);

export default router;


