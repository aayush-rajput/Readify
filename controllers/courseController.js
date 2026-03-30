import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Video from '../models/Video.js';

// GET /api/courses — get published courses (or all for instructor)
export const getCourses = async (req, res) => {
  try {
    const filter = {};
    if (!req.user || req.user.role === 'student') {
      filter.is_published = true;
    } else if (req.user.role === 'teacher') {
      // Teachers see their own courses
      filter.instructor = req.user._id;
    }
    // admin sees all

    const courses = await Course.find(filter).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/courses/published — public route, only published
export const getPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ is_published: true }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/courses/:id
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const videos = await Video.find({ course: course._id }).sort({ order_index: 1 });

    res.json({ ...course.toObject(), videos });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/courses
export const createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      ...req.body,
      instructor: req.user._id,
      instructor_name: req.body.instructor_name || req.user.name,
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/courses/:id
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/courses/:id
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/courses/:id/enroll
export const enrollInCourse = async (req, res) => {
  try {
    const existing = await Enrollment.findOne({
      user: req.user._id,
      course: req.params.id,
    });

    if (existing) {
      return res.status(400).json({ message: 'Already enrolled' });
    }

    const enrollment = await Enrollment.create({
      user: req.user._id,
      course: req.params.id,
    });

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/courses/enrollments/my
export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id })
      .populate('course')
      .sort({ last_accessed_at: -1 });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/courses/:id/progress
export const updateProgress = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: req.params.id,
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Not enrolled in this course' });
    }

    const { videoId } = req.body;
    if (videoId && !enrollment.completed_videos.includes(videoId)) {
      enrollment.completed_videos.push(videoId);
    }

    // Calculate progress
    const totalVideos = await Video.countDocuments({ course: req.params.id });
    if (totalVideos > 0) {
      enrollment.progress_percentage = Math.round(
        (enrollment.completed_videos.length / totalVideos) * 100
      );
    }

    enrollment.last_accessed_at = new Date();
    await enrollment.save();

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
