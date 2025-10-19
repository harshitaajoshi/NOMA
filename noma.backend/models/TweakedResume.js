import mongoose from 'mongoose';

const tweakedResumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    originalResumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true
    },
    internshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Internship',
      required: true
    },
    // Analysis results
    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    matchedSkills: [{
      skill: String,
      occurrences: Number,
      importance: {
        type: String,
        enum: ['high', 'medium', 'low']
      }
    }],
    missingSkills: [{
      skill: String,
      importance: {
        type: String,
        enum: ['high', 'medium', 'low']
      },
      category: String
    }],
    suggestions: [{
      priority: {
        type: String,
        enum: ['high', 'medium', 'low']
      },
      category: String,
      suggestion: String
    }],
    strengths: [{
      type: String
    }],
    keywordAnalysis: {
      jobKeywords: [String],
      resumeKeywords: [String],
      coveragePercentage: Number
    },
    // Improved content
    tweakedContent: {
      improvedSummary: String,
      improvedExperience: [{
        title: String,
        company: String,
        bulletPoints: [String]
      }],
      improvedSkills: String,
      additionalSections: mongoose.Schema.Types.Mixed
    },
    // PDF generation
    generatedPdfUrl: {
      type: String,
      default: null
    },
    pdfGenerated: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Index for user queries
tweakedResumeSchema.index({ userId: 1, createdAt: -1 });
tweakedResumeSchema.index({ internshipId: 1 });

const TweakedResume = mongoose.model('TweakedResume', tweakedResumeSchema);

export default TweakedResume;


