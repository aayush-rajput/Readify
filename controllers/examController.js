import Exam from '../models/Exam.js';
import Result from '../models/Result.js';

// GET /api/exams/course/:courseId
export const getExamsByCourse = async (req, res) => {
  try {
    const filter = { course: req.params.courseId };
    // Students only see published exams
    if (!req.user || req.user.role === 'student') {
      filter.is_published = true;
    }
    const exams = await Exam.find(filter).select('-questions.correctAnswer').sort({ createdAt: -1 });
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/exams/:id — for attempting (hides correct answers from students)
export const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    // Hide correct answers for students
    if (req.user.role === 'student') {
      const examObj = exam.toObject();
      examObj.questions = examObj.questions.map(q => ({
        ...q,
        correctAnswer: undefined,
      }));
      return res.json(examObj);
    }

    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/exams
export const createExam = async (req, res) => {
  try {
    const exam = await Exam.create({
      ...req.body,
      created_by: req.user._id,
    });
    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/exams/:id
export const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    if (exam.created_by.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/exams/:id
export const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    await Exam.findByIdAndDelete(req.params.id);
    res.json({ message: 'Exam deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/exams/:id/submit — auto-evaluate
export const submitExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    // Check if already submitted
    const existing = await Result.findOne({ user: req.user._id, exam: exam._id });
    if (existing) {
      return res.status(400).json({ message: 'Exam already submitted', result: existing });
    }

    const { answers: submittedAnswers } = req.body;
    // submittedAnswers: [{ questionIndex: 0, selectedAnswer: 2 }, ...]

    let score = 0;
    const evaluatedAnswers = submittedAnswers.map((a) => {
      const question = exam.questions[a.questionIndex];
      const isCorrect = question && a.selectedAnswer === question.correctAnswer;
      if (isCorrect) score++;
      return {
        questionIndex: a.questionIndex,
        selectedAnswer: a.selectedAnswer,
        isCorrect: !!isCorrect,
      };
    });

    const total_questions = exam.questions.length;
    const percentage = total_questions > 0 ? Math.round((score / total_questions) * 100) : 0;

    const result = await Result.create({
      user: req.user._id,
      exam: exam._id,
      score,
      total_questions,
      percentage,
      answers: evaluatedAnswers,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
