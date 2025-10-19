import axios from 'axios';

/**
 * GitHub repository configuration
 * Using: SimplifyJobs/Summer2026-Internships (41.9k stars, most popular!)
 * Source: https://github.com/SimplifyJobs/Summer2026-Internships
 */
const GITHUB_CONFIG = {
  owner: 'SimplifyJobs',
  repo: 'Summer2026-Internships',
  branch: 'dev',
  filePath: 'README.md'
};

/**
 * Fetch raw content from GitHub repository
 */
export const fetchInternshipRepo = async () => {
  try {
    const { owner, repo, branch, filePath } = GITHUB_CONFIG;
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;

    // Raw GitHub content doesn't need authentication
    const response = await axios.get(url, {
      timeout: 30000, // 30 second timeout
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });
    return response.data;
  } catch (error) {
    console.error('GitHub fetch error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw new Error('Failed to fetch internship data from GitHub');
  }
};

/**
 * Parse HTML table to extract internship data
 * Format: <tr><td>Company</td><td>Role</td><td>Location</td><td>Application Link</td><td>Age</td></tr>
 */
export const parseMarkdownTable = (markdownContent) => {
  try {
    const internships = [];
    
    // Extract all table rows
    const rowRegex = /<tr>(.*?)<\/tr>/gs;
    const rows = [...markdownContent.matchAll(rowRegex)];

    for (const rowMatch of rows) {
      const rowContent = rowMatch[1];
      
      // Skip header rows and separator rows
      if (rowContent.includes('<th>') || rowContent.includes('---')) {
        continue;
      }

      // Extract all td cells from this row
      const cellRegex = /<td[^>]*>(.*?)<\/td>/gs;
      const cells = [...rowContent.matchAll(cellRegex)].map(m => m[1]);

      // Need at least 4 columns (company, role, location, application)
      if (cells.length >= 4) {
        const internship = extractInternshipData(cells);
        if (internship) {
          internships.push(internship);
        }
      }
    }

    console.log(`📊 Parsed ${internships.length} internships from GitHub`);
    return internships;
  } catch (error) {
    console.error('Parse error:', error);
    return [];
  }
};

/**
 * Extract structured data from HTML table columns
 * Columns: [Company, Role, Location, Application, Age]
 */
export const extractInternshipData = (columns) => {
  try {
    // Skip rows that are continuations (indicated by ↳)
    if (columns[0]?.includes('↳')) {
      return null;
    }

    // Extract company name (remove HTML tags and emojis)
    const companyHtml = columns[0] || '';
    const company = cleanText(companyHtml);
    
    // Extract role
    const role = cleanText(columns[1] || 'Internship');
    
    // Extract location (replace </br> with commas)
    const locationHtml = columns[2] || 'Remote';
    const location = locationHtml.replace(/<\/?br>/gi, ', ').trim();
    const cleanLocation = cleanText(location);
    
    // Extract application link from the 4th column
    const applicationHtml = columns[3] || '';
    
    // Skip if position is closed (indicated by 🔒)
    if (applicationHtml.includes('🔒')) {
      return null;
    }
    
    // Extract the actual application URL (first href in the td)
    const linkMatch = applicationHtml.match(/href="([^"]+)"/);
    if (!linkMatch) {
      return null;
    }
    
    const applyLink = linkMatch[1];
    
    // Skip if it's just the Simplify link
    if (applyLink.includes('simplify.jobs') && !applicationHtml.includes('Apply')) {
      return null;
    }

    // Extract tags from role
    const tags = extractTags(role);

    // Create a description from role
    const description = `${role} position at ${company} in ${cleanLocation}`;

    return {
      company: company || 'Unknown Company',
      role: role || 'Internship',
      location: cleanLocation || 'Remote',
      applyLink: applyLink.trim(),
      description,
      deadline: null, // Age column doesn't give us deadline
      tags,
      sourceRepo: `${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}`,
      isActive: true
    };
  } catch (error) {
    console.error('Extract error:', error);
    return null;
  }
};

/**
 * Clean text by removing HTML tags, markdown formatting, and emojis
 */
const cleanText = (text) => {
  return text
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove markdown links
    .replace(/[🔒✅❌🎯🔥⚡️🛂🇺🇸🎓]/g, '') // Remove common emojis
    .replace(/\*\*/g, '') // Remove bold markers
    .replace(/<\/?strong>/gi, '') // Remove strong tags
    .replace(/<\/?a[^>]*>/gi, '') // Remove anchor tags
    .replace(/&nbsp;/g, ' ') // Replace HTML spaces
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
};

/**
 * Extract tags from role description
 */
const extractTags = (roleText) => {
  const tags = [];
  const keywords = ['Frontend', 'Backend', 'Full Stack', 'ML', 'AI', 'Data', 'Mobile', 'iOS', 'Android', 'DevOps', 'SRE'];
  
  for (const keyword of keywords) {
    if (roleText.toLowerCase().includes(keyword.toLowerCase())) {
      tags.push(keyword);
    }
  }
  
  return tags;
};

/**
 * Parse date from string (flexible format)
 */
const parseDate = (dateStr) => {
  try {
    // Common formats: "MM/DD/YYYY", "YYYY-MM-DD", "Month DD, YYYY"
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date;
    }
  } catch (error) {
    // Ignore parse errors
  }
  return null;
};

/**
 * Sync internships to database
 * Returns count of new internships added
 */
export const syncInternshipsToDatabase = async (Internship) => {
  try {
    const markdownContent = await fetchInternshipRepo();
    const internships = parseMarkdownTable(markdownContent);

    let addedCount = 0;
    let updatedCount = 0;

    for (const internship of internships) {
      // Check if internship already exists (by company + role)
      const existing = await Internship.findOne({
        company: internship.company,
        role: internship.role
      });

      if (existing) {
        // Update existing internship
        existing.location = internship.location;
        existing.applyLink = internship.applyLink;
        existing.deadline = internship.deadline;
        existing.tags = internship.tags;
        existing.lastUpdated = new Date();
        existing.isActive = true;
        await existing.save();
        updatedCount++;
      } else {
        // Create new internship
        await Internship.create(internship);
        addedCount++;
      }
    }

    console.log(`✅ Synced ${addedCount} new, ${updatedCount} updated internships`);
    
    return {
      added: addedCount,
      updated: updatedCount,
      total: internships.length
    };
  } catch (error) {
    console.error('Sync error:', error);
    throw error;
  }
};

