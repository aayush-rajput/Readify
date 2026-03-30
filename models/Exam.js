import mongoose from 'mongoose';

const questionSchema = mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true }, // index into options array
});

const examSchema = mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    time_limit_minutes: { type: Number, default: 30 },
    questions: [questionSchema],
    is_published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Exam = mongoose.model('Exam', examSchema);
export default Exam;
