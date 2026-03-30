import express from 'express';
import { getMyResults, getResultsByExam, getResultById } from '../controllers/resultController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my', protect, getMyResults);
router.get('/exam/:examId', protect, authorize('teacher', 'admin'), getResultsByExam);
router.get('/:id', protect, getResultById);

export default router;
