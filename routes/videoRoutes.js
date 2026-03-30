import express from 'express';
import {
  getVideosByCourse,
  getVideoById,
  addVideo,
  updateVideo,
  deleteVideo,
} from '../controllers/videoController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/course/:courseId', getVideosByCourse);
router.get('/:id', getVideoById);
router.post('/', protect, authorize('teacher', 'admin'), addVideo);
router.put('/:id', protect, authorize('teacher', 'admin'), updateVideo);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteVideo);

export default router;
