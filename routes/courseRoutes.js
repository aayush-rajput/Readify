import express from 'express';
import {
  getCourses,
  getPublishedCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  getMyEnrollments,
  updateProgress,
} from '../controllers/courseController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/published', getPublishedCourses);
router.get('/enrollments/my', protect, getMyEnrollments);
router.get('/', protect, getCourses);
router.get('/:id', getCourseById);
router.post('/', protect, authorize('teacher', 'admin'), createCourse);
router.put('/:id', protect, authorize('teacher', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteCourse);
router.post('/:id/enroll', protect, enrollInCourse);
router.put('/:id/progress', protect, updateProgress);

export default router;
