import mongoose from 'mongoose';

const courseSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    thumbnail_url: { type: String, default: '' },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    instructor_name: { type: String, required: true },
    category: { type: String, required: true },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    duration_hours: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    is_published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Course = mongoose.model('Course', courseSchema);
export default Course;
