import Result from '../models/Result.js';

// GET /api/results/my — student's own results
export const getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ user: req.user._id })
      .populate({
        path: 'exam',
        select: 'title course time_limit_minutes',
        populate: { path: 'course', select: 'title' },
      })
      .sort({ createdAt: -1 });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/results/exam/:examId — instructor view
export const getResultsByExam = async (req, res) => {
  try {
    const results = await Result.find({ exam: req.params.examId })
      .populate('user', 'name email')
      .sort({ percentage: -1 });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/results/:id — single result detail
export const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate({
        path: 'exam',
        populate: { path: 'course', select: 'title' },
      })
      .populate('user', 'name email');

    if (!result) return res.status(404).json({ message: 'Result not found' });

    // Students can only see their own results
    if (req.user.role === 'student' && result.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
