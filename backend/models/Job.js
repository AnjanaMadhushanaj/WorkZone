const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    rate: {
      type: String,
      required: [true, 'Rate is required'],
    },
    amount: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      enum: ['Part-Time', 'Full-Time', 'Freelance', 'Contract'],
      required: [true, 'Job type is required'],
    },
    tags: {
      type: [String],
      default: [],
    },
    logoColor: {
      type: String,
      default: 'bg-blue-500',
    },
    description: {
      type: String,
      default: '',
    },
    postedBy: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Text index for full-text search across title, company, tags, and description
jobSchema.index(
  { title: 'text', company: 'text', tags: 'text', description: 'text' },
  { weights: { title: 10, company: 5, tags: 5, description: 1 } }
);

module.exports = mongoose.model('Job', jobSchema);
