import Resume from '../models/Resume.js';
import { extractText } from '../utils/textExtractor.js';
import fs from 'fs/promises';
import path from 'path';

/**
 * @desc    Upload resume
 * @route   POST /api/resume/upload
 * @access  Private
 */
export const uploadResume = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const { originalname, filename, path: filePath, size, mimetype } = req.file;

    // Determine file type
    const fileType = mimetype.includes('pdf') ? 'pdf' : 'docx';

    // Extract text from file
    let parsedText = '';
    try {
      parsedText = await extractText(filePath, fileType);
    } catch (error) {
      console.error('Text extraction failed:', error);
      // Continue even if extraction fails
    }

    // Save resume info to database
    const resume = await Resume.create({
      userId: req.user._id,
      originalFileName: originalname,
      fileUrl: `/uploads/${filename}`, // Relative path
      fileType,
      fileSize: size,
      parsedText
    });

    res.status(201).json({
      success: true,
      message: 'Resume uploaded successfully',
      data: {
        resume: {
          id: resume._id,
          originalFileName: resume.originalFileName,
          fileType: resume.fileType,
          fileSize: resume.fileSize,
          uploadedAt: resume.uploadedAt,
          hasText: parsedText.length > 0
        }
      }
    });
  } catch (error) {
    console.error('Upload resume error:', error);
    
    // Delete uploaded file if database save fails
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Error uploading resume',
      error: error.message
    });
  }
};

/**
 * @desc    Get all user's resumes
 * @route   GET /api/resume
 * @access  Private
 */
export const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id })
      .select('-parsedText') // Exclude large text field from list
      .sort({ uploadedAt: -1 }); // Most recent first

    res.status(200).json({
      success: true,
      count: resumes.length,
      data: { resumes }
    });
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching resumes',
      error: error.message
    });
  }
};

/**
 * @desc    Get single resume with full text
 * @route   GET /api/resume/:id
 * @access  Private
 */
export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id // Ensure user owns this resume
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { resume }
    });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching resume',
      error: error.message
    });
  }
};

/**
 * @desc    Delete resume
 * @route   DELETE /api/resume/:id
 * @access  Private
 */
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id // Ensure user owns this resume
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    // Delete file from filesystem
    const filePath = path.join(process.cwd(), 'uploads', path.basename(resume.fileUrl));
    try {
      await fs.unlink(filePath);
    } catch (fileError) {
      console.error('Error deleting file:', fileError);
      // Continue even if file deletion fails
    }

    // Delete from database
    await Resume.deleteOne({ _id: resume._id });

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting resume',
      error: error.message
    });
  }
};


