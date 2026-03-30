import mongoose from 'mongoose';

const videoSchema = mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    url: { type: String, required: true },
    duration_minutes: { type: Number, default: 0 },
    order_index: { type: Number, default: 0 },
  },
  { timestamps: true }
);

videoSchema.index({ course: 1, order_index: 1 });

const Video = mongoose.model('Video', videoSchema);
export default Video;
