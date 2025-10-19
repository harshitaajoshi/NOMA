import TweakedResume from '../models/TweakedResume.js';
import Resume from '../models/Resume.js';
import Internship from '../models/Internship.js';
import {
  analyzeResumeForJob,
  generateTweakedResume,
  getQuickMatchScore
} from '../services/geminiService.js';
import {
  generateResumePDF,
  savePDFToFile,
  generatePDFFilename
} from '../services/pdfService.js';
import path from 'path';
import fs from 'fs/promises';

/**
 * @desc    Tweak resume for specific job (full analysis)
 * @route   POST /api/tweak
 * @access  Private
 */
export const tweakResumeForJob = async (req, res) => {
  try {
    const { resumeId, internshipId } = req.body;

    // Validate inputs
    if (!resumeId || !internshipId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide resumeId and internshipId'
      });
    }

    // Fetch resume
    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.user._id
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    if (!resume.parsedText || resume.parsedText.length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Resume text could not be extracted. Please upload a different file.'
      });
    }

    // Fetch internship
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    // Build job description
    const jobDescription = `
Company: ${internship.company}
Role: ${internship.role}
Location: ${internship.location}
Description: ${internship.description || 'Not provided'}
Tags: ${internship.tags.join(', ')}
    `.trim();

    // Check if analysis already exists (avoid duplicate processing)
    const existingTweak = await TweakedResume.findOne({
      userId: req.user._id,
      originalResumeId: resumeId,
      internshipId
    });

    if (existingTweak) {
      return res.status(200).json({
        success: true,
        message: 'Resume already analyzed for this job',
        data: { tweaked: existingTweak },
        cached: true
      });
    }

    // Perform AI analysis
    console.log('🤖 Analyzing resume with Gemini...');
    const analysis = await analyzeResumeForJob(resume.parsedText, jobDescription);

    // Generate improved content
    console.log('✨ Generating improved content...');
    const tweakedContent = await generateTweakedResume(
      resume.parsedText,
      jobDescription,
      analysis
    );

    // Save to database
    const tweakedResume = await TweakedResume.create({
      userId: req.user._id,
      originalResumeId: resumeId,
      internshipId,
      matchScore: analysis.matchScore,
      matchedSkills: analysis.matchedSkills || [],
      missingSkills: analysis.missingSkills || [],
      suggestions: analysis.suggestions || [],
      strengths: analysis.strengths || [],
      keywordAnalysis: analysis.keywordAnalysis || {},
      tweakedContent
    });

    // Populate references
    await tweakedResume.populate(['originalResumeId', 'internshipId']);

    res.status(201).json({
      success: true,
      message: 'Resume analyzed and tweaked successfully',
      data: { tweaked: tweakedResume }
    });
  } catch (error) {
    console.error('Tweak resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing resume',
      error: error.message
    });
  }
};

/**
 * @desc    Get quick match score only (fast preview)
 * @route   POST /api/tweak/quick-score
 * @access  Private
 */
export const getQuickScore = async (req, res) => {
  try {
    const { resumeId, internshipId } = req.body;

    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.user._id
    });

    if (!resume || !resume.parsedText) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found or text not extracted'
      });
    }

    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    const jobDescription = `${internship.company} - ${internship.role}: ${internship.description}`;
    const score = await getQuickMatchScore(resume.parsedText, jobDescription);

    res.status(200).json({
      success: true,
      data: {
        matchScore: score,
        resumeId,
        internshipId
      }
    });
  } catch (error) {
    console.error('Quick score error:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating match score',
      error: error.message
    });
  }
};

/**
 * @desc    Get all tweaked resumes for user
 * @route   GET /api/tweak
 * @access  Private
 */
export const getTweakedResumes = async (req, res) => {
  try {
    const tweakedResumes = await TweakedResume.find({ userId: req.user._id })
      .populate(['originalResumeId', 'internshipId'])
      .sort({ createdAt: -1 })
      .select('-tweakedContent'); // Exclude large content from list view

    res.status(200).json({
      success: true,
      count: tweakedResumes.length,
      data: { tweakedResumes }
    });
  } catch (error) {
    console.error('Get tweaked resumes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tweaked resumes',
      error: error.message
    });
  }
};

/**
 * @desc    Get single tweaked resume with full details
 * @route   GET /api/tweak/:id
 * @access  Private
 */
export const getTweakedResumeById = async (req, res) => {
  try {
    const tweaked = await TweakedResume.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate(['originalResumeId', 'internshipId']);

    if (!tweaked) {
      return res.status(404).json({
        success: false,
        message: 'Tweaked resume not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { tweaked }
    });
  } catch (error) {
    console.error('Get tweaked resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tweaked resume',
      error: error.message
    });
  }
};

/**
 * @desc    Delete tweaked resume
 * @route   DELETE /api/tweak/:id
 * @access  Private
 */
export const deleteTweakedResume = async (req, res) => {
  try {
    const tweaked = await TweakedResume.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!tweaked) {
      return res.status(404).json({
        success: false,
        message: 'Tweaked resume not found'
      });
    }

    await TweakedResume.deleteOne({ _id: tweaked._id });

    res.status(200).json({
      success: true,
      message: 'Tweaked resume deleted successfully'
    });
  } catch (error) {
    console.error('Delete tweaked resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting tweaked resume',
      error: error.message
    });
  }
};

