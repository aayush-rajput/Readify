import mongoose from 'mongoose';

const enrollmentSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    progress_percentage: { type: Number, default: 0, min: 0, max: 100 },
    completed_videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
    last_accessed_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
export default Enrollment;
