import express from 'express';
import {
  getExamsByCourse,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  submitExam,
} from '../controllers/examController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/course/:courseId', protect, getExamsByCourse);
router.get('/:id', protect, getExamById);
router.post('/', protect, authorize('teacher', 'admin'), createExam);
router.put('/:id', protect, authorize('teacher', 'admin'), updateExam);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteExam);
router.post('/:id/submit', protect, submitExam);

export default router;
