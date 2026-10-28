# NOMA 
  An AI-Powered Internship Organizer

<div align="center">

**Apply. Organize. Evolve.**

A modern, intelligent platform that transforms internship hunting from chaos into clarity.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey?style=flat-square&logo=express)](https://expressjs.com/)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

</div>

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Key Components](#key-components)
- [Troubleshooting](#troubleshooting)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**NOMA** is a full-stack web application designed to help students and job seekers manage, track, and optimize their internship applications with the power of AI. It eliminates the chaos of spreadsheets and browser tabs by providing a centralized, intelligent platform for the entire internship hunt workflow.

### Why NOMA?

- 📊 **1400+ Live Internships** - Automatically synced from GitHub repositories that update internships as soon as they are posted!
- 🤖 **AI-Powered Resume Optimization** - Tailored for each job description
- 📈 **Visual Analytics Dashboard** - Track progress with beautiful charts
- ⏰ **Smart Reminders** - Never miss an application deadline
- 🎯 **Match Scoring** - Know how well you fit each role
- 📚 **Resume Library** - Manage multiple optimized versions

---

## ✨ Features

### 🔍 1. Smart Discovery
- **1400+ Curated Opportunities**: Auto-synced from the Pitt CSC Summer 2025 internship repository
- **Advanced Search & Filters**: Filter by location, company, role, and more
- **Real-time Updates**: Automatically fetches the latest internship postings
- **One-Click Add to Tracker**: Seamlessly organize your applications

### 🗂️ 2. Intelligent Tracker
- **Visual Status Management**: Track applications through stages (Saved, Applied, Interview, Rejected)
- **Tabular Display**: Clean, organized view of all tracked internships
- **Status Labels**: Color-coded status indicators
- **Quick Actions**: Apply, set reminders, or optimize resumes directly from the tracker
- **Deadline Tracking**: Visual countdown for upcoming deadlines

### 🤖 3. AI Resume Optimization
- **Gemini AI Integration**: Powered by Google's Gemini 2.0 Flash model
- **Match Score Analysis**: Get a percentage match between your resume and job description
- **Intelligent Suggestions**: Receive specific, actionable recommendations
- **Skills Gap Analysis**: Identify missing keywords and skills
- **Content Tweaking**: AI-generated improvements for summary, experience, and skills
- **ATS-Optimized**: Suggestions designed to pass Applicant Tracking Systems

### 📊 4. Visual Dashboard
- **Application Status Pie Chart**: See your application distribution at a glance
- **Progress Tracking**: Monitor applications vs. deadlines per week
- **Deadline Countdown**: Cards showing next 3 upcoming deadlines
- **Match Score Stats**: Track your average resume match score
- **Recent Activity Feed**: Stay updated on your latest actions
- **Summary Tiles**: Quick stats (Total Internships, Applications, Reminders)

### 📚 5. Resume Library
- **PDF Upload**: Support for PDF and DOCX resume formats
- **Text Extraction**: Automatic parsing of resume content
- **Multiple Versions**: Manage base resumes and AI-optimized versions
- **Optimization History**: Track all AI-tweaked resumes by company/role
- **In-App Preview**: View AI suggestions and changes
- **Easy Management**: Delete outdated versions

### 🔔 6. Smart Notifications
- **Deadline Alerts**: Get notified 7 days before application deadlines
- **Reminder System**: Set custom reminders for follow-ups
- **AI Suggestions**: Proactive recommendations for resume optimization
- **New Internship Alerts**: Stay updated on latest postings
- **Bell Icon Indicator**: Red dot for unread notifications
- **Organized Panel**: Categorized notifications with quick actions

### 🎨 7. Modern UI/UX
- **Black, White, Gray Theme**: Sleek, minimal, professional aesthetic
- **Animated Background**: Scroll-triggered gradient effects
- **Celestial Elements**: Subtle star patterns and animations
- **Responsive Design**: Optimized for desktop and mobile
- **Framer Motion Animations**: Smooth transitions and interactions
- **Toast Notifications**: Beautiful, non-intrusive feedback

---

## 🛠️ Tech Stack

### **Backend** (`noma.backend/`)

| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime environment | 20+ |
| **Express.js** | Web framework | 4.x |
| **Gemini API** | AI-powered resume analysis | 2.0 Flash |
| **Axios** | HTTP client for GitHub API | Latest |
| **Multer** | File upload handling | Latest |
| **pdf-parse** | PDF text extraction | Latest |
| **mammoth** | DOCX text extraction | Latest |
| **Puppeteer** | PDF generation | Latest |
| **CORS** | Cross-origin resource sharing | Latest |
| **dotenv** | Environment variable management | Latest |

### **Frontend** (`noma.frontend/`)

| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React framework (App Router) | 14 |
| **React** | UI library | 18+ |
| **TypeScript** | Type safety | Latest |
| **Tailwind CSS** | Utility-first CSS | 4.x |
| **Shadcn UI** | Component library | Latest |
| **Framer Motion** | Animation library | Latest |
| **Recharts** | Data visualization | Latest |
| **Axios** | HTTP client | Latest |
| **Lucide React** | Icon library | Latest |

### **Data Storage**

- **JSON Files**: Local file-based storage (no database required)
  - `data/internships.json` - Internship listings
  - `data/tracker.json` - User tracked internships
  - `data/resumes.json` - Uploaded resumes
  - `data/tweaked.json` - AI-optimized resume analyses

---

## 📁 Project Structure

```
noma/
├── noma.backend/                   # Backend API server
│   ├── config/                     # Configuration files (deprecated)
│   ├── controllers/                # Route controllers (deprecated)
│   ├── middleware/                 # Express middleware (deprecated)
│   ├── models/                     # Data models (deprecated)
│   ├── routes/                     # API routes (deprecated)
│   ├── services/
│   │   ├── geminiService.js        # AI resume analysis logic
│   │   ├── githubService.js        # GitHub API integration
│   │   └── pdfService.js           # PDF generation
│   ├── templates/
│   │   └── resumeTemplate.js       # HTML template for PDF resumes
│   ├── utils/
│   │   ├── jsonStorage.js          # JSON file operations
│   │   └── textExtractor.js        # PDF/DOCX text extraction
│   ├── data/                       # JSON storage (gitignored)
│   │   ├── internships.json
│   │   ├── tracker.json
│   │   ├── resumes.json
│   │   └── tweaked.json
│   ├── uploads/                    # User resume uploads (gitignored)
│   ├── generated/                  # AI-generated PDFs (gitignored)
│   ├── server-simple.js            # Main server file (simplified)
│   ├── package.json                # Backend dependencies
│   ├── .env                        # Environment variables (gitignored)
│   └── API_DOCUMENTATION.md        # Detailed API docs
│
├── noma.frontend/                  # Frontend Next.js app
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── page.tsx            # Dashboard home
│   │   │   ├── internships/
│   │   │   │   └── page.tsx        # Explore internships
│   │   │   ├── tracker/
│   │   │   │   └── page.tsx        # My tracker
│   │   │   └── resumes/
│   │   │       └── page.tsx        # Resume library
│   │   ├── page.tsx                # Landing page
│   │   ├── layout.tsx              # Root layout
│   │   ├── globals.css             # Global styles
│   │   ├── icon.svg                # Favicon
│   │   └── apple-icon.svg          # Apple touch icon
│   ├── components/
│   │   ├── DashboardLayout.tsx     # Dashboard wrapper
│   │   ├── NotificationPanel.tsx   # Notification sidebar
│   │   └── ui/                     # Shadcn UI components
│   ├── lib/
│   │   ├── axios.ts                # Axios instance
│   │   └── api/                    # API client functions
│   ├── public/
│   │   └── favicon.svg             # Favicon
│   ├── package.json                # Frontend dependencies
│   └── tailwind.config.ts          # Tailwind configuration
│
├── .gitignore                      # Git ignore rules
└── README.md                       # This file
```

---

## 📋 Prerequisites

Before running NOMA, ensure you have the following installed:

- **Node.js** (v20 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **Google Gemini API Key** - [Get one here](https://makersuite.google.com/app/apikey)
- **(Optional) GitHub Personal Access Token** - [Create one here](https://github.com/settings/tokens)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/harshitaajoshi/NOMA.git
cd NOMA
```

### 2. Install Backend Dependencies

```bash
cd noma.backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../noma.frontend
npm install
```

### 4. Create Required Directories

The backend needs certain directories for file storage:

```bash
cd ../noma.backend
mkdir -p data uploads generated
```

### 5. Initialize Data Files

Create empty JSON files for data storage:

```bash
touch data/internships.json
touch data/tracker.json
touch data/resumes.json
touch data/tweaked.json

# Initialize with empty arrays
echo "[]" > data/internships.json
echo "[]" > data/tracker.json
echo "[]" > data/resumes.json
echo "[]" > data/tweaked.json
```

---

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in `noma.backend/`:

```bash
cd noma.backend
touch .env
```

Add the following variables:

```env
# Server Configuration
PORT=5001

# Google Gemini API (Required for AI features)
GEMINI_API_KEY=your_gemini_api_key_here

# GitHub API (Optional - for better rate limits)
GITHUB_TOKEN=your_github_token_here

# GitHub Repository for Internships
REPO_OWNER=pittcsc
REPO_NAME=Summer2025-Internships
REPO_BRANCH=dev
```

### Getting API Keys

#### **Gemini API Key** (Required)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy and paste into `.env`

#### **GitHub Token** (Optional but Recommended)
1. Visit [GitHub Settings > Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select scopes: `public_repo`
4. Copy and paste into `.env`

### Frontend Configuration

The frontend is pre-configured to connect to `http://localhost:5001`. If you change the backend port, update:

- `noma.frontend/lib/axios.ts` - Update `baseURL`

---

## 🏃 Running the Application

### Development Mode

#### 1. Start the Backend Server

```bash
cd noma.backend
npm start
```

The backend will run on `http://localhost:5001`

You should see:
```
✅ Server running on port 5001
✅ Gemini API initialized with gemini-2.0-flash-exp
✅ Server ready to accept requests
```

#### 2. Start the Frontend (New Terminal)

```bash
cd noma.frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

You should see:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Ready in Xms
```

#### 3. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 📘 Usage Guide

### First Time Setup

1. **Visit Homepage**: Explore the features and learn about NOMA
2. **Click "Open Dashboard"**: Access the main application
3. **Upload Resume**: Navigate to "Resume Library" and upload your PDF/DOCX resume

### Exploring Internships

1. Go to **"Explore Internships"** from the sidebar
2. Browse 1400+ live internship opportunities
3. Use search bar to filter by company or role
4. Click **"Add to Tracker"** on interesting positions
5. Toast notification confirms addition

### Managing Your Tracker

1. Navigate to **"My Tracker"** from the sidebar
2. View all tracked internships in a clean table
3. Filter by status: All, Apply Later, Applied, Interview, Rejected
4. Actions available:
   - **Apply**: Opens application link in new tab
   - **Set Reminder**: Choose a date for follow-up reminder
   - **AI Optimize**: Analyze resume against job description
   - **Remove**: Delete from tracker

### AI Resume Optimization

1. From tracker, click **"AI Optimize"** on any internship
2. Wait for AI analysis (3-5 seconds)
3. View AI suggestions pop-up showing:
   - **Match Score**: Percentage compatibility (0-100%)
   - **Matched Skills**: Skills you already have
   - **Missing Skills**: Skills to add
   - **Detailed Suggestions**: Specific improvements
   - **Keyword Analysis**: ATS optimization insights
4. Review suggestions and manually update your resume
5. Close pop-up (minimizes to icon)
6. Re-run analysis after updates to see improved score

### Resume Library Management

1. Go to **"Resume Library"**
2. **Original Resume Section**:
   - Upload new PDF/DOCX files
   - View uploaded date
   - Delete if needed
3. **Optimized Resumes Section**:
   - See all AI-analyzed versions
   - Organized by company and role
   - Click on card to view AI analysis again
   - Delete icon to remove old analyses

### Dashboard Analytics

1. Navigate to **"Dashboard"**
2. View comprehensive analytics:
   - **Summary Cards**: Total tracked, applications, reminders, avg match score
   - **Application Status Chart**: Pie chart of status distribution
   - **Application Progress**: Line chart showing weekly trends
   - **Weekly Deadlines**: Bar chart of applications vs deadlines
   - **Upcoming Deadlines**: Next 3 deadlines with countdown
   - **Recent Activity**: Latest 5 actions

### Notifications

1. Click **Bell Icon** in navigation bar
2. Red dot indicates unread notifications
3. View notifications panel:
   - **Deadlines**: Applications due within 7 days
   - **Reminders**: Custom reminders within 3 days
   - **AI Suggestions**: Tracked internships without optimization
   - **New Internships**: Recently posted opportunities (last 3 days)
4. Click action links to navigate to relevant pages

---

## 📚 API Documentation

### Base URL
```
http://localhost:5001/api
```

### Key Endpoints

#### Internships
- `GET /internships` - Fetch all internships
- `GET /internships/search?q=query` - Search internships
- `POST /internships/refresh` - Sync from GitHub

#### Tracker
- `GET /tracker` - Get all tracked internships
- `POST /tracker` - Add internship to tracker
- `PATCH /tracker/:id` - Update tracked internship
- `DELETE /tracker/:id` - Remove from tracker

#### Resumes
- `GET /resumes` - Get all resumes
- `POST /resumes/upload` - Upload new resume
- `DELETE /resumes/:id` - Delete resume

#### AI Optimization
- `GET /tweak` - Get all AI analyses
- `POST /tweak/analyze` - Analyze resume for job
- `POST /tweak/quick-score` - Get quick match score
- `GET /tweak/:id/download` - Download optimized PDF
- `DELETE /tweak/:id` - Delete AI analysis

#### Dashboard
- `GET /dashboard/stats` - Get dashboard analytics

#### Notifications
- `GET /notifications/count` - Get notification count

For detailed API documentation, see:
```
noma.backend/API_DOCUMENTATION.md
```

---

## 🔑 Key Components

### Backend Services

#### `geminiService.js`
- **AI Model**: Google Gemini 2.0 Flash Exp
- **Functions**:
  - `initGemini()`: Initialize API connection
  - `parseResumeText(text)`: Extract structured data from resume
  - `analyzeResumeForJob(resume, jobDesc)`: Full AI analysis with suggestions
  - `getQuickMatchScore(resume, jobDesc)`: Fast compatibility score

#### `githubService.js`
- **Purpose**: Fetch and parse internship data from GitHub
- **Functions**:
  - `fetchInternshipRepo()`: Get raw README HTML
  - `parseHtmlTable(html)`: Extract table data from HTML
  - `extractInternshipData(rows)`: Structure internship objects
  - `syncInternshipsFromGithub()`: Full sync pipeline

#### `pdfService.js`
- **Purpose**: Generate professional PDF resumes
- **Uses**: Puppeteer for HTML to PDF conversion
- **Template**: `templates/resumeTemplate.js`

#### `textExtractor.js`
- **Purpose**: Extract text from uploaded files
- **Supports**: PDF (pdf-parse), DOCX (mammoth)

#### `jsonStorage.js`
- **Purpose**: Manage local JSON file storage
- **Functions**: CRUD operations on JSON files

### Frontend Components

#### `DashboardLayout.tsx`
- Sidebar navigation
- Header with notifications
- Mobile responsive design
- Route handling

#### `NotificationPanel.tsx`
- Slide-in panel animation
- Categorized notifications
- Action links
- Auto-refresh on open

#### Dashboard Pages
- `page.tsx` - Dashboard home with analytics
- `internships/page.tsx` - Explore internships
- `tracker/page.tsx` - Manage tracked applications
- `resumes/page.tsx` - Resume library

### UI Libraries

- **Shadcn UI**: Pre-built, customizable components
- **Framer Motion**: Smooth animations and transitions
- **Recharts**: Beautiful, responsive charts
- **Lucide React**: Clean, consistent icons

---

## 🐛 Troubleshooting

### Backend Issues

#### Server Won't Start
```bash
# Check if port 5001 is in use
lsof -i :5001

# Kill process if needed
kill -9 <PID>

# Or change PORT in .env
```

#### Gemini API Errors
```
Error: Gemini API not initialized
```
**Solution**: Check your `GEMINI_API_KEY` in `.env`

#### GitHub Rate Limit
```
Error: GitHub API rate limit exceeded
```
**Solution**: Add `GITHUB_TOKEN` to `.env`

#### File Upload Errors
```
Error: ENOENT: no such file or directory, open 'uploads/...'
```
**Solution**: Create directories:
```bash
mkdir -p uploads generated data
```

### Frontend Issues

#### Can't Connect to Backend
```
Network Error / CORS Error
```
**Solution**: 
1. Ensure backend is running on port 5001
2. Check `lib/axios.ts` baseURL matches backend port

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

#### Environment Issues
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Data Issues

#### Lost Data
- All data is in `noma.backend/data/*.json`
- Ensure files exist and contain valid JSON arrays `[]`

#### Corrupted JSON
```bash
# Reset data files
echo "[]" > data/internships.json
echo "[]" > data/tracker.json
echo "[]" > data/resumes.json
echo "[]" > data/tweaked.json
```

---

## 🚀 Future Enhancements

### Planned Features

- [ ] **User Authentication**: Multiple user accounts with JWT
- [ ] **Email Notifications**: Automated deadline reminders via email
- [ ] **Calendar Integration**: Sync deadlines with Google Calendar
- [ ] **Cover Letter Generator**: AI-powered cover letter creation
- [ ] **Application Templates**: Save and reuse application responses
- [ ] **Interview Prep**: AI-generated interview questions based on JD
- [ ] **Company Research**: Auto-fetch company info and culture insights
- [ ] **Networking Tracker**: Track connections and referrals
- [ ] **Offer Comparison**: Compare multiple job offers side-by-side
- [ ] **Mobile App**: React Native mobile version
- [ ] **Chrome Extension**: Quick-save internships while browsing
- [ ] **Database Migration**: Move to MongoDB/PostgreSQL for scalability
- [ ] **Real-time Collaboration**: Share tracker with mentors/peers
- [ ] **Analytics Export**: Export data to CSV/PDF reports
- [ ] **Dark/Light Mode Toggle**: Theme customization

### Technical Improvements

- [ ] Add comprehensive test suite (Jest, Playwright)
- [ ] Implement Redis caching for API responses
- [ ] Add rate limiting and request throttling
- [ ] Implement WebSocket for real-time updates
- [ ] Add Docker containerization
- [ ] CI/CD pipeline with GitHub Actions
- [ ] Error tracking with Sentry
- [ ] Performance monitoring
- [ ] A/B testing framework
- [ ] Progressive Web App (PWA) support

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Reporting Bugs

1. Check existing issues to avoid duplicates
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, Node version, etc.)

### Suggesting Features

1. Open an issue with tag `enhancement`
2. Describe the feature and its benefits
3. Provide examples or mockups if possible

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit with clear messages: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style

- Follow existing code conventions
- Use meaningful variable names
- Add comments for complex logic
- Update documentation for API changes

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 NOMA

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- **Pitt CSC** - For maintaining the Summer 2025 internship repository
- **Google Gemini** - For providing the AI capabilities
- **Next.js Team** - For the amazing React framework
- **Shadcn** - For beautiful, accessible UI components
- **Vercel** - For Next.js and hosting platform
- **Open Source Community** - For all the libraries used



---

<div align="center">

**Made with ❤️ by Harshita**

</div>

