import TweakedResume from '../models/TweakedResume.js';
import {
  generateResumePDF,
  savePDFToFile,
  generatePDFFilename
} from '../services/pdfService.js';
import path from 'path';
import fs from 'fs/promises';

/**
 * @desc    Generate and download PDF for tweaked resume
 * @route   GET /api/tweak/:id/download
 * @access  Private
 */
export const downloadTweakedResumePDF = async (req, res) => {
  try {
    const tweaked = await TweakedResume.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('internshipId');

    if (!tweaked) {
      return res.status(404).json({
        success: false,
        message: 'Tweaked resume not found'
      });
    }

    // Check if PDF already generated
    if (tweaked.pdfGenerated && tweaked.generatedPdfUrl) {
      const filePath = path.join(process.cwd(), tweaked.generatedPdfUrl);
      
      // Check if file exists
      try {
        await fs.access(filePath);
        
        // File exists, send it
        return res.download(filePath, `resume_${tweaked.internshipId.company}.pdf`, (err) => {
          if (err) {
            console.error('Download error:', err);
            return res.status(500).json({
              success: false,
              message: 'Error downloading PDF'
            });
          }
        });
      } catch (accessError) {
        // File doesn't exist, regenerate
        console.log('PDF file not found, regenerating...');
      }
    }

    // Generate new PDF
    console.log('🎨 Generating PDF...');
    const pdfBuffer = await generateResumePDF(tweaked);

    // Save to file
    const filename = generatePDFFilename(req.user._id, tweaked.internshipId._id);
    const fileUrl = await savePDFToFile(pdfBuffer, filename);

    // Update database
    tweaked.generatedPdfUrl = fileUrl;
    tweaked.pdfGenerated = true;
    await tweaked.save();

    // Send PDF
    const filePath = path.join(process.cwd(), fileUrl);
    res.download(filePath, `resume_${tweaked.internshipId.company}.pdf`, (err) => {
      if (err) {
        console.error('Download error:', err);
        return res.status(500).json({
          success: false,
          message: 'Error downloading PDF'
        });
      }
    });
  } catch (error) {
    console.error('PDF download error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating/downloading PDF',
      error: error.message
    });
  }
};

/**
 * @desc    Generate PDF preview (returns buffer, not download)
 * @route   GET /api/tweak/:id/preview
 * @access  Private
 */
export const previewTweakedResumePDF = async (req, res) => {
  try {
    const tweaked = await TweakedResume.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('internshipId');

    if (!tweaked) {
      return res.status(404).json({
        success: false,
        message: 'Tweaked resume not found'
      });
    }

    // Generate PDF
    const pdfBuffer = await generateResumePDF(tweaked);

    // Send as inline PDF (opens in browser)
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF preview error:', error);
    res.status(500).json({
      success: false,
      message: 'Error previewing PDF',
      error: error.message
    });
  }
};


