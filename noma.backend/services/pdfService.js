import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { generateResumeHTML } from '../templates/resumeTemplate.js';

/**
 * Generate PDF from tweaked resume data
 */
export const generateResumePDF = async (tweakedResumeData, originalResume = null) => {
  let browser;
  
  try {
    const { tweakedContent, internship } = tweakedResumeData;

    // Prepare data for template
    const resumeData = {
      name: originalResume?.name || tweakedContent.improvedSummary?.split(',')[0]?.trim() || 'Candidate',
      email: originalResume?.email || 'email@example.com',
      phone: originalResume?.phone || '',
      summary: tweakedContent.improvedSummary || tweakedContent.summary || '',
      experience: tweakedContent.improvedExperience || tweakedContent.experience || [],
      skills: tweakedContent.improvedSkills || tweakedContent.skills || '',
      education: tweakedContent.additionalSections?.education || originalResume?.education || [],
      projects: tweakedContent.additionalSections?.projects || tweakedContent.additionalSections?.relevantProjects || originalResume?.projects || [],
      targetCompany: internship?.company || '',
      targetRole: internship?.role || ''
    };

    // Generate HTML
    const html = generateResumeHTML(resumeData);

    // Launch Puppeteer
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Generate PDF buffer
    const pdfBuffer = await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      }
    });

    await browser.close();

    return pdfBuffer;
  } catch (error) {
    if (browser) {
      await browser.close();
    }
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF');
  }
};

/**
 * Save PDF to filesystem
 */
export const savePDFToFile = async (pdfBuffer, filename) => {
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads', 'tweaked-resumes');
    
    // Create directory if it doesn't exist
    await fs.mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, filename);
    await fs.writeFile(filePath, pdfBuffer);

    return `/uploads/tweaked-resumes/${filename}`;
  } catch (error) {
    console.error('Save PDF error:', error);
    throw new Error('Failed to save PDF');
  }
};

/**
 * Generate PDF filename
 */
export const generatePDFFilename = (userId, internshipId) => {
  const timestamp = Date.now();
  return `resume_${userId}_${internshipId}_${timestamp}.pdf`;
};

/**
 * Upload to Cloudinary (optional - for production)
 */
export const uploadPDFToCloudinary = async (pdfBuffer) => {
  // TODO: Implement Cloudinary upload if needed
  // For MVP, we'll use local storage
  return null;
};

/**
 * Delete PDF file
 */
export const deletePDFFile = async (filePath) => {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    await fs.unlink(fullPath);
  } catch (error) {
    console.error('Delete PDF error:', error);
    // Don't throw - file might already be deleted
  }
};

