# NOMA Backend - Complete API Documentation

## 🌐 Base URL
```
http://localhost:5000/api
```

## 🔐 Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📍 Endpoints Overview

### 1. **Authentication** (`/api/auth`)

#### Register User
```http
POST /api/auth/register
```
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { "id": "...", "name": "John Doe", "email": "john@example.com" },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login User
```http
POST /api/auth/login
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Headers: Authorization: Bearer <token>
```

---

### 2. **Resume Management** (`/api/resume`)

#### Upload Resume
```http
POST /api/resume/upload
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data
```
**Body:** (form-data)
- `resume`: File (PDF or DOCX, max 5MB)

**Response:**
```json
{
  "success": true,
  "message": "Resume uploaded successfully",
  "data": {
    "resume": {
      "id": "...",
      "originalFileName": "John_Resume.pdf",
      "fileType": "pdf",
      "fileSize": 245678,
      "uploadedAt": "2025-10-19T...",
      "hasText": true
    }
  }
}
```

#### Get All Resumes
```http
GET /api/resume
Headers: Authorization: Bearer <token>
```

#### Get Single Resume
```http
GET /api/resume/:id
Headers: Authorization: Bearer <token>
```

#### Delete Resume
```http
DELETE /api/resume/:id
Headers: Authorization: Bearer <token>
```

---

### 3. **Internships** (`/api/internships`)

#### Get All Internships (Public)
```http
GET /api/internships?page=1&limit=20&location=Remote&company=Tesla
```
**Query Params:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `location`: Filter by location
- `company`: Filter by company name
- `tags`: Comma-separated tags (e.g., "Frontend,React")

**Response:**
```json
{
  "success": true,
  "count": 20,
  "total": 156,
  "page": 1,
  "pages": 8,
  "data": {
    "internships": [
      {
        "id": "...",
        "company": "Tesla",
        "role": "Software Engineer Intern",
        "location": "Austin, TX",
        "deadline": "2025-11-15",
        "applyLink": "https://...",
        "tags": ["Backend", "Python"],
        "isActive": true
      }
    ]
  }
}
```

#### Search Internships
```http
GET /api/internships/search?q=frontend
```

#### Get Single Internship
```http
GET /api/internships/:id
```

#### Get Statistics
```http
GET /api/internships/stats
```

#### Refresh from GitHub
```http
POST /api/internships/refresh
```
Fetches latest internships from GitHub repository and syncs to database.

---

### 4. **Internship Tracker** (`/api/tracker`)

#### Add to Tracker
```http
POST /api/tracker
Headers: Authorization: Bearer <token>
```
**Body:**
```json
{
  "internshipId": "65f1a2b3c4d5e6f7g8h9i0j1",
  "status": "saved",
  "notes": "Interesting ML role",
  "remindDate": "2025-11-01"
}
```

#### Get Tracked Internships
```http
GET /api/tracker?status=saved
Headers: Authorization: Bearer <token>
```

#### Update Tracker
```http
PATCH /api/tracker/:id
Headers: Authorization: Bearer <token>
```
**Body:**
```json
{
  "status": "applied",
  "notes": "Applied today!",
  "remindDate": null
}
```

#### Remove from Tracker
```http
DELETE /api/tracker/:id
Headers: Authorization: Bearer <token>
```

#### Get Upcoming Reminders
```http
GET /api/tracker/reminders/upcoming
Headers: Authorization: Bearer <token>
```

---

### 5. **Resume Tweaking (AI)** (`/api/tweak`) ⭐ STAR FEATURE

#### Tweak Resume for Job (Full Analysis)
```http
POST /api/tweak
Headers: Authorization: Bearer <token>
```
**Body:**
```json
{
  "resumeId": "65f1a2b3c4d5e6f7g8h9i0j1",
  "internshipId": "65f1a2b3c4d5e6f7g8h9i0j2"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Resume analyzed and tweaked successfully",
  "data": {
    "tweaked": {
      "id": "...",
      "matchScore": 87,
      "matchedSkills": [
        { "skill": "React", "occurrences": 3, "importance": "high" },
        { "skill": "Node.js", "occurrences": 2, "importance": "high" }
      ],
      "missingSkills": [
        { "skill": "Docker", "importance": "high", "category": "technical" },
        { "skill": "AWS", "importance": "medium", "category": "technical" }
      ],
      "suggestions": [
        {
          "priority": "high",
          "category": "skills",
          "suggestion": "Add Docker containerization experience"
        }
      ],
      "strengths": ["Strong React portfolio", "Relevant internship experience"],
      "keywordAnalysis": {
        "jobKeywords": ["React", "Node.js", "Docker", "AWS"],
        "resumeKeywords": ["React", "Node.js"],
        "coveragePercentage": 50
      },
      "tweakedContent": {
        "improvedSummary": "...",
        "improvedExperience": [...],
        "improvedSkills": "..."
      }
    }
  }
}
```

#### Quick Match Score
```http
POST /api/tweak/quick-score
Headers: Authorization: Bearer <token>
```
**Body:**
```json
{
  "resumeId": "...",
  "internshipId": "..."
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "matchScore": 75,
    "resumeId": "...",
    "internshipId": "..."
  }
}
```

#### Get All Tweaked Resumes
```http
GET /api/tweak
Headers: Authorization: Bearer <token>
```

#### Get Single Tweaked Resume
```http
GET /api/tweak/:id
Headers: Authorization: Bearer <token>
```

#### Download PDF Resume
```http
GET /api/tweak/:id/download
Headers: Authorization: Bearer <token>
```
Downloads a professionally formatted PDF resume.

#### Preview PDF Resume
```http
GET /api/tweak/:id/preview
Headers: Authorization: Bearer <token>
```
Opens PDF in browser for preview.

#### Delete Tweaked Resume
```http
DELETE /api/tweak/:id
Headers: Authorization: Bearer <token>
```

---

### 6. **Dashboard** (`/api/dashboard`)

#### Get Dashboard Statistics
```http
GET /api/dashboard
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalInternshipsTracked": 12,
      "appliedCount": 5,
      "savedCount": 7,
      "interviewCount": 2,
      "rejectedCount": 1,
      "offerCount": 0,
      "totalResumes": 2,
      "totalTweaked": 8,
      "avgMatchScore": 82,
      "successRate": 0
    },
    "upcomingDeadlines": [
      {
        "id": "...",
        "internship": { "company": "Tesla", "role": "..." },
        "remindDate": "2025-11-05",
        "status": "saved",
        "daysUntil": 5
      }
    ],
    "recentActivity": [
      {
        "type": "tweaked",
        "action": "Tweaked resume for Tesla ML Intern",
        "date": "2025-10-19T...",
        "score": 87
      }
    ],
    "applicationsByWeek": [
      {
        "week": "2025-10-13",
        "count": 3,
        "applied": 3,
        "interview": 0
      }
    ]
  }
}
```

#### Get Match Score Insights
```http
GET /api/dashboard/insights
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "scoreStats": {
      "average": 82,
      "highest": 92,
      "lowest": 68,
      "total": 8
    },
    "topMatches": [
      {
        "company": "Tesla",
        "role": "ML Intern",
        "score": 92,
        "strengths": ["Relevant experience", "Strong portfolio"]
      }
    ],
    "topMissingSkills": [
      { "skill": "Docker", "count": 5, "importance": "high" },
      { "skill": "AWS", "count": 4, "importance": "medium" }
    ],
    "recommendations": [
      {
        "priority": "medium",
        "message": "Top missing skill: Docker. Consider adding projects...",
        "action": "Learn skill"
      }
    ]
  }
}
```

---

## 🚀 Complete User Flow Example

### 1. Register & Login
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane","email":"jane@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@test.com","password":"test123"}'

# Save the token from response
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 2. Upload Resume
```bash
curl -X POST http://localhost:5000/api/resume/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "resume=@/path/to/resume.pdf"
```

### 3. Browse Internships
```bash
curl http://localhost:5000/api/internships?page=1&limit=10
```

### 4. Add to Tracker
```bash
curl -X POST http://localhost:5000/api/tracker \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"internshipId":"<internship_id>","status":"saved"}'
```

### 5. Tweak Resume (AI Magic!)
```bash
curl -X POST http://localhost:5000/api/tweak \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"resumeId":"<resume_id>","internshipId":"<internship_id>"}'
```

### 6. Download Tweaked PDF
```bash
curl http://localhost:5000/api/tweak/<tweak_id>/download \
  -H "Authorization: Bearer $TOKEN" \
  --output resume_tweaked.pdf
```

### 7. View Dashboard
```bash
curl http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

---

## ⚠️ Error Responses

All endpoints return consistent error format:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (dev mode only)"
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found
- `500` - Server Error

---

## 🔧 Environment Setup

Before starting, set these in `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/noma
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:3000
```

---

## 📊 Database Models

### User
- name, email, password (hashed)

### Resume
- userId, originalFileName, fileUrl, parsedText

### Internship
- company, role, location, deadline, applyLink, tags

### TrackedInternship
- userId, internshipId, status, remindDate, notes

### TweakedResume
- userId, originalResumeId, internshipId
- matchScore, matchedSkills, missingSkills, suggestions
- tweakedContent, generatedPdfUrl

---

## 🎯 Next Steps
1. Start backend: `npm run dev`
2. Test endpoints with Postman/Thunder Client
3. Build frontend to consume these APIs
4. Deploy to production (Vercel + Railway)

---

**Built with ❤️ for NOMA Hackathon Project**


