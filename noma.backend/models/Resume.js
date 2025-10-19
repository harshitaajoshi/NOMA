import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    originalFileName: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    fileType: {
      type: String,
      enum: ['pdf', 'docx'],
      required: true
    },
    fileSize: {
      type: Number, // in bytes
      required: true
    },
    parsedText: {
      type: String,
      default: ''
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
resumeSchema.index({ userId: 1, uploadedAt: -1 });

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;


