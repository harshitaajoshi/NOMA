import mongoose from 'mongoose';

const trackedInternshipSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    internshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Internship',
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ['saved', 'applied', 'interview', 'rejected', 'offer'],
      default: 'saved'
    },
    remindDate: {
      type: Date,
      default: null
    },
    notes: {
      type: String,
      default: '',
      maxlength: 500
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    appliedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Compound index - prevent duplicate tracking
trackedInternshipSchema.index({ userId: 1, internshipId: 1 }, { unique: true });

// Index for reminders
trackedInternshipSchema.index({ remindDate: 1, status: 1 });

const TrackedInternship = mongoose.model('TrackedInternship', trackedInternshipSchema);

export default TrackedInternship;


