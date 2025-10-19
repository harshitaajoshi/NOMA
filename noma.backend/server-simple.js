import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Import services
import { fetchInternshipRepo, parseMarkdownTable } from './services/githubService.js';
import { extractTextFromPDF, extractTextFromDOCX } from './utils/textExtractor.js';
import { initGemini, analyzeResumeForJob, getQuickMatchScore } from './services/geminiService.js';
import { generateResumePDF } from './services/pdfService.js';
import { 
  initStorage, 
  readData, 
  writeData, 
  addItem, 
  updateItem, 
  deleteItem, 
  findById 
} from './utils/jsonStorage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize storage and Gemini
await initStorage();
initGemini();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/generated', express.static('generated'));

// File upload configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = 'uploads/';
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.docx', '.doc'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'NOMA Backend is running!' });
});

// ============================================
// INTERNSHIP ROUTES
// ============================================

// Get all internships
app.get('/api/internships', async (req, res) => {
  try {
    const internships = await readData('internships');
    const { search, location } = req.query;
    let filtered = [...internships];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(i =>
        i.company.toLowerCase().includes(searchLower) ||
        i.role.toLowerCase().includes(searchLower)
      );
    }

    if (location) {
      const locationLower = location.toLowerCase();
      filtered = filtered.filter(i =>
        i.location.toLowerCase().includes(locationLower)
      );
    }

    res.json({
      internships: filtered,
      total: filtered.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get internship by ID
app.get('/api/internships/:id', async (req, res) => {
  try {
    const internship = await findById('internships', req.params.id);
    if (!internship) {
      return res.status(404).json({ error: 'Internship not found' });
    }
    res.json(internship);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Refresh internships from GitHub
app.post('/api/internships/refresh', async (req, res) => {
  try {
    console.log('🔄 Refreshing internships from GitHub...');
    const content = await fetchInternshipRepo();
    const parsed = parseMarkdownTable(content);
    
    // Assign IDs to internships
    const internships = parsed.map((i, idx) => ({
      ...i,
      id: `internship-${idx}-${Date.now()}`
    }));
    
    await writeData('internships', internships);

    res.json({
      message: 'Internships refreshed successfully',
      count: internships.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get internship stats
app.get('/api/internships/stats', async (req, res) => {
  try {
    const internships = await readData('internships');
    const stats = {
      total: internships.length,
      byLocation: {},
      byCompany: {}
    };

    internships.forEach(i => {
      stats.byLocation[i.location] = (stats.byLocation[i.location] || 0) + 1;
      stats.byCompany[i.company] = (stats.byCompany[i.company] || 0) + 1;
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// RESUME ROUTES
// ============================================

// Upload resume
app.post('/api/resume/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();

    // Extract text
    let parsedText = '';
    if (ext === '.pdf') {
      parsedText = await extractTextFromPDF(filePath);
    } else if (ext === '.docx' || ext === '.doc') {
      parsedText = await extractTextFromDOCX(filePath);
    }

    const resume = {
      id: `resume-${Date.now()}`,
      originalFileName: req.file.originalname,
      fileUrl: `http://localhost:${PORT}/${req.file.path}`,
      parsedText,
      uploadedAt: new Date().toISOString()
    };

    await addItem('resumes', resume);

    res.json({
      message: 'Resume uploaded successfully',
      resume
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all resumes
app.get('/api/resume', async (req, res) => {
  try {
    const resumes = await readData('resumes');
    res.json({ resumes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete resume
app.delete('/api/resume/:id', async (req, res) => {
  try {
    const resume = await findById('resumes', req.params.id);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    // Delete file
    const filePath = resume.fileUrl.replace(`http://localhost:${PORT}/`, '');
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error('Error deleting file:', err);
    }

    await deleteItem('resumes', req.params.id);

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// TRACKER ROUTES
// ============================================

// Get all tracked internships
app.get('/api/tracker', async (req, res) => {
  try {
    const tracked = await readData('tracked');
    res.json({ tracked });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add to tracker
app.post('/api/tracker', async (req, res) => {
  try {
    const { internshipId, status = 'saved', remindDate } = req.body;

    const internship = await findById('internships', internshipId);
    if (!internship) {
      return res.status(404).json({ error: 'Internship not found' });
    }

    const tracked = {
      id: `tracked-${Date.now()}`,
      internshipId,
      internship,
      status,
      remindDate: remindDate ? new Date(remindDate).toISOString() : null,
      addedAt: new Date().toISOString()
    };

    await addItem('tracked', tracked);

    res.json({
      message: 'Added to tracker',
      tracked
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update tracked internship
app.put('/api/tracker/:id', async (req, res) => {
  try {
    const { status, remindDate } = req.body;
    
    const updates = {};
    if (status) updates.status = status;
    if (remindDate !== undefined) updates.remindDate = remindDate ? new Date(remindDate).toISOString() : null;
    if (status === 'applied') updates.appliedAt = new Date().toISOString();

    const tracked = await updateItem('tracked', req.params.id, updates);
    
    if (!tracked) {
      return res.status(404).json({ error: 'Tracked internship not found' });
    }

    res.json({
      message: 'Tracker updated',
      tracked
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete from tracker
app.delete('/api/tracker/:id', async (req, res) => {
  try {
    const deleted = await deleteItem('tracked', req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Tracked internship not found' });
    }

    res.json({ message: 'Removed from tracker' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get upcoming reminders
app.get('/api/tracker/reminders/upcoming', async (req, res) => {
  try {
    const tracked = await readData('tracked');
    const now = new Date();
    const upcoming = tracked
      .filter(t => t.remindDate && new Date(t.remindDate) > now)
      .sort((a, b) => new Date(a.remindDate) - new Date(b.remindDate))
      .slice(0, 5);

    res.json({ reminders: upcoming });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// AI TWEAK ROUTES
// ============================================

// Get all tweaked resumes
app.get('/api/tweak', async (req, res) => {
  try {
    const tweaked = await readData('tweaked');
    res.json({ tweaked });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analyze resume for internship
app.post('/api/tweak/analyze', async (req, res) => {
  try {
    const { resumeId, internshipId, internship: internshipData } = req.body;

    const resume = await findById('resumes', resumeId);

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Use provided internship data or look it up
    let internship = internshipData;
    if (!internship && internshipId) {
      internship = await findById('internships', internshipId);
    }

    if (!internship) {
      return res.status(404).json({ error: 'Internship not found' });
    }

    const jobDescription = `${internship.role} at ${internship.company}\nLocation: ${internship.location}\n${internship.description || ''}`;

    console.log(`🤖 Analyzing resume for ${internship.company} - ${internship.role}...`);
    const analysis = await analyzeResumeForJob(resume.parsedText, jobDescription);

    const tweaked = {
      id: `tweaked-${Date.now()}`,
      resumeId,
      internshipId: internshipId || internship.id,
      ...analysis,
      internship: {
        company: internship.company,
        role: internship.role,
        location: internship.location
      },
      createdAt: new Date().toISOString()
    };

    await addItem('tweaked', tweaked);

    console.log(`✅ Analysis complete: ${analysis.matchScore}% match`);
    res.json({
      message: 'Resume analyzed successfully',
      analysis: tweaked
    });
  } catch (error) {
    console.error('❌ Analysis error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get quick match score
app.post('/api/tweak/quick-score', async (req, res) => {
  try {
    const { resumeId, internshipId } = req.body;

    const resume = await findById('resumes', resumeId);
    const internship = await findById('internships', internshipId);

    if (!resume || !internship) {
      return res.status(404).json({ error: 'Resume or internship not found' });
    }

    const jobDescription = `${internship.role} at ${internship.company}`;
    const score = await getQuickMatchScore(resume.parsedText, jobDescription);

    res.json({ score });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete tweaked resume
app.delete('/api/tweak/:id', async (req, res) => {
  try {
    const deleted = await deleteItem('tweaked', req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Tweaked resume not found' });
    }

    console.log(`🗑️  Deleted AI analysis: ${req.params.id}`);
    res.json({ message: 'AI analysis deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Download tweaked resume as PDF
app.get('/api/tweak/:id/download', async (req, res) => {
  try {
    const tweaked = await findById('tweaked', req.params.id);
    if (!tweaked) {
      return res.status(404).json({ error: 'Tweaked resume not found' });
    }

    // Get original resume for additional data
    const resume = await findById('resumes', tweaked.resumeId);

    // Generate PDF on-the-fly each time (ensures latest content)
    console.log(`📥 Generating PDF for ${tweaked.internship?.company}...`);
    const pdfPath = await generateResumePDF(tweaked, resume);
    
    // Save PDF URL for future reference
    const pdfUrl = `http://localhost:${PORT}/${pdfPath}`;
    await updateItem('tweaked', tweaked.id, { pdfUrl });

    console.log(`✅ PDF ready: ${pdfPath}`);
    res.download(pdfPath);
  } catch (error) {
    console.error('PDF download error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// NOTIFICATION ROUTES
// ============================================

// Get notification count
app.get('/api/notifications/count', async (req, res) => {
  try {
    const tracked = await readData('tracker');
    const internships = await readData('internships');
    const resumes = await readData('resumes');
    const tweaked = await readData('tweaked');

    let count = 0;
    const today = new Date();

    // Count upcoming deadlines (next 7 days)
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    tracked.forEach((item) => {
      if (item.internship?.deadline) {
        const deadline = new Date(item.internship.deadline);
        if (deadline >= today && deadline <= nextWeek) {
          count++;
        }
      }
    });

    // Count upcoming reminders (next 3 days)
    const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    tracked.forEach((item) => {
      if (item.remindDate) {
        const reminderDate = new Date(item.remindDate);
        if (reminderDate >= today && reminderDate <= threeDaysFromNow) {
          count++;
        }
      }
    });

    // Count AI suggestions (tracked but not optimized, max 2)
    if (resumes.length > 0) {
      const notApplied = tracked.filter((item) => 
        item.status === 'saved' || item.status === 'interested'
      );
      const withoutOptimization = notApplied.filter((item) => 
        !tweaked.some((t) => t.internshipId === item.internshipId)
      ).slice(0, 2);
      count += withoutOptimization.length;
    }

    // Count new internships (last 3 days, max 3)
    const threeDaysAgo = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);
    const newInternships = internships.filter((intern) => {
      if (!intern.datePosted) return false;
      const postedDate = new Date(intern.datePosted);
      return postedDate >= threeDaysAgo;
    }).slice(0, 3);
    count += newInternships.length;

    res.json({ count });
  } catch (error) {
    console.error('Notification count error:', error);
    res.status(500).json({ error: error.message, count: 0 });
  }
});

// ============================================
// DASHBOARD ROUTES
// ============================================

// Get dashboard stats
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const internships = await readData('internships');
    const tracked = await readData('tracked');
    const tweaked = await readData('tweaked');
    
    const today = new Date();
    
    // Calculate upcoming deadlines with days left
    const upcomingDeadlines = tracked
      .filter(t => t.internship?.deadline)
      .map(t => {
        const deadline = new Date(t.internship.deadline);
        const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
        return {
          ...t,
          daysLeft
        };
      })
      .filter(t => t.daysLeft > 0)
      .sort((a, b) => a.daysLeft - b.daysLeft);
    
    // Recent activity
    const recentActivity = [...tracked]
      .sort((a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0))
      .slice(0, 5)
      .map(t => ({
        type: 'Added to tracker',
        internship: `${t.internship?.company} - ${t.internship?.role}`,
        timestamp: t.addedAt || new Date().toISOString()
      }));
    
    const stats = {
      totalTracked: tracked.length,
      appliedCount: tracked.filter(t => t.status === 'applied').length,
      remindersSet: tracked.filter(t => t.remindDate).length,
      avgMatchScore: tweaked.length > 0
        ? Math.round(tweaked.reduce((sum, t) => sum + t.matchScore, 0) / tweaked.length)
        : 0,
      statusBreakdown: {
        'apply-later': tracked.filter(t => t.status === 'saved' || t.status === 'interested').length,
        'applied': tracked.filter(t => t.status === 'applied').length,
        'interview': tracked.filter(t => t.status === 'interviewing').length,
        'rejected': tracked.filter(t => t.status === 'rejected').length,
      },
      upcomingDeadlines,
      recentActivity
    };

    res.json({ stats });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get dashboard insights
app.get('/api/dashboard/insights', async (req, res) => {
  try {
    const tracked = await readData('tracked');
    
    const insights = {
      topCompanies: [],
      upcomingDeadlines: tracked
        .filter(t => t.remindDate)
        .sort((a, b) => new Date(a.remindDate) - new Date(b.remindDate))
        .slice(0, 5),
      recentActivity: [...tracked]
        .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
        .slice(0, 5)
    };

    res.json(insights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// START SERVER
// ============================================

// Load initial internship data
(async () => {
  try {
    // Check if we have existing internships
    let internships = await readData('internships');
    
    if (internships.length === 0) {
      console.log('🚀 Loading internships from GitHub (first time)...');
      const content = await fetchInternshipRepo();
      const parsed = parseMarkdownTable(content);
      internships = parsed.map((i, idx) => ({
        ...i,
        id: `internship-${idx}-${Date.now()}`
      }));
      await writeData('internships', internships);
      console.log(`✅ Loaded ${internships.length} internships from GitHub`);
    } else {
      console.log(`✅ Loaded ${internships.length} internships from storage`);
    }
  } catch (error) {
    console.error('❌ Error loading initial data:', error.message);
  }

  app.listen(PORT, async () => {
    const internships = await readData('internships');
    const resumes = await readData('resumes');
    const tracked = await readData('tracked');
    
    console.log(`\n🎯 NOMA Backend running on http://localhost:${PORT}`);
    console.log(`📊 Internships: ${internships.length}`);
    console.log(`📄 Resumes: ${resumes.length}`);
    console.log(`⭐ Tracked: ${tracked.length}`);
    console.log(`💾 Data persists in JSON files\n`);
  });
})();

