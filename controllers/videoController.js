import Video from '../models/Video.js';
import Course from '../models/Course.js';

// GET /api/videos/course/:courseId
export const getVideosByCourse = async (req, res) => {
  try {
    const videos = await Video.find({ course: req.params.courseId }).sort({ order_index: 1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/videos/:id
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate('course', 'title');
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/videos
export const addVideo = async (req, res) => {
  try {
    const course = await Course.findById(req.body.course);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const video = await Video.create(req.body);
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/videos/:id
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const updated = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/videos/:id
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
