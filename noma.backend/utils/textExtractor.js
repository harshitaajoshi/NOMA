import mammoth from 'mammoth';
import fs from 'fs/promises';

/**
 * Extract text from PDF file
 */
export const extractTextFromPDF = async (filePath) => {
  try {
    // Dynamically import pdf-parse only when needed to avoid initialization issues
    const pdfParse = (await import('pdf-parse')).default;
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

/**
 * Extract text from DOCX file
 */
export const extractTextFromDOCX = async (filePath) => {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error('DOCX extraction error:', error);
    throw new Error('Failed to extract text from DOCX');
  }
};

/**
 * Main function to extract text based on file type
 */
export const extractText = async (filePath, fileType) => {
  try {
    if (fileType === 'pdf') {
      return await extractTextFromPDF(filePath);
    } else if (fileType === 'docx') {
      return await extractTextFromDOCX(filePath);
    } else {
      throw new Error('Unsupported file type');
    }
  } catch (error) {
    console.error('Text extraction error:', error);
    return ''; // Return empty string if extraction fails
  }
};

