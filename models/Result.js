import mongoose from 'mongoose';

const answerSchema = mongoose.Schema({
  questionIndex: { type: Number, required: true },
  selectedAnswer: { type: Number, required: true },
  isCorrect: { type: Boolean, required: true },
});

const resultSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    score: { type: Number, required: true },
    total_questions: { type: Number, required: true },
    percentage: { type: Number, required: true },
    answers: [answerSchema],
  },
  { timestamps: true }
);

resultSchema.index({ user: 1, exam: 1 });

const Result = mongoose.model('Result', resultSchema);
export default Result;
