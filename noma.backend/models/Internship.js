import mongoose from 'mongoose';

const internshipSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    role: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    location: {
      type: String,
      default: 'Remote',
      trim: true
    },
    deadline: {
      type: Date,
      default: null
    },
    description: {
      type: String,
      default: ''
    },
    applyLink: {
      type: String,
      required: true
    },
    sourceRepo: {
      type: String,
      default: 'pittcsc/Summer2025-Internships'
    },
    tags: [{
      type: String,
      trim: true
    }],
    isActive: {
      type: Boolean,
      default: true
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Compound index for search
internshipSchema.index({ company: 'text', role: 'text', location: 'text' });

// Index for active internships
internshipSchema.index({ isActive: 1, lastUpdated: -1 });

const Internship = mongoose.model('Internship', internshipSchema);

export default Internship;


