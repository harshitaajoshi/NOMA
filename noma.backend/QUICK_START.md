# 🚀 NOMA Backend - Quick Start Guide

## ⚡ 5-Minute Setup

### 1. Install & Configure (2 mins)
```bash
cd noma.backend
npm install
```

Edit `.env` - **IMPORTANT: Add your Gemini API key!**
```env
GEMINI_API_KEY=your_key_here   # Get from https://makersuite.google.com/app/apikey
MONGO_URI=mongodb://localhost:27017/noma
JWT_SECRET=noma_secret_2025
```

### 2. Start MongoDB (1 min)
```bash
# Option A: Local MongoDB
mongod

# Option B: Use MongoDB Atlas (free cloud database)
# Create cluster at mongodb.com/atlas
# Replace MONGO_URI in .env with Atlas connection string
```

### 3. Start Server (1 min)
```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running in development mode on port 5000
✅ Gemini API initialized
```

### 4. Test It! (1 min)
```bash
# Health check
curl http://localhost:5000

# Should return:
# {"message":"🚀 NOMA Backend API is running!","version":"1.0.0","status":"healthy"}
```

---

## 🧪 Quick Test Flow

### Using cURL:

```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Save the token from response
TOKEN="paste_token_here"

# 2. Get internships (public - no auth needed)
curl http://localhost:5000/api/internships?limit=5

# 3. Upload resume
curl -X POST http://localhost:5000/api/resume/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "resume=@/path/to/your/resume.pdf"

# Save resume ID from response
RESUME_ID="paste_id_here"

# 4. Get an internship ID
curl http://localhost:5000/api/internships | grep '"id"' | head -1
INTERNSHIP_ID="paste_id_here"

# 5. AI Resume Analysis (THE MAGIC!)
curl -X POST http://localhost:5000/api/tweak \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"resumeId\":\"$RESUME_ID\",\"internshipId\":\"$INTERNSHIP_ID\"}"

# 6. View dashboard
curl http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

### Using Postman/Thunder Client:

1. Import collection from `API_DOCUMENTATION.md`
2. Create environment variable `{{baseUrl}}` = `http://localhost:5000/api`
3. Run requests in order: Register → Login → Upload → Tweak
4. Token auto-saves after login

---

## 🎯 Demo Data Setup

### Populate with Internships:
```bash
curl -X POST http://localhost:5000/api/internships/refresh
```
This fetches real internships from GitHub!

### Create Sample User:
```javascript
// In MongoDB or through API
{
  "name": "Demo Student",
  "email": "demo@noma.com",
  "password": "demo123"
}
```

---

## 🐛 Common Issues

### "MongoDB connection failed"
- ✅ Make sure MongoDB is running (`mongod`)
- ✅ Or use MongoDB Atlas free tier
- ✅ Check MONGO_URI in .env

### "Gemini API not initialized"
- ✅ Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- ✅ Add to `.env` as `GEMINI_API_KEY=your_key`
- ✅ Restart server

### "Resume text extraction failed"
- ✅ Only PDF and DOCX supported
- ✅ Max 5MB file size
- ✅ Make sure file isn't corrupted

### Port 5000 already in use
```bash
# Find and kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Or change PORT in .env
PORT=5001
```

---

## 📊 Verify Everything Works

Run this checklist:

- [ ] Server starts without errors
- [ ] MongoDB connects successfully
- [ ] Gemini API initializes
- [ ] Can register new user
- [ ] Can login and get token
- [ ] Can upload resume (PDF/DOCX)
- [ ] Can fetch internships
- [ ] Can add internship to tracker
- [ ] Can run AI resume analysis (returns match score)
- [ ] Can download PDF
- [ ] Can view dashboard stats

If all ✅ = **BACKEND READY FOR FRONTEND!**

---

## 🔥 For Hackathon Demo

### Before Demo:
1. **Seed Data**:
   - Create 2-3 test accounts
   - Upload sample resumes
   - Sync internships from GitHub
   - Generate some tweaked resumes
   - Add tracked internships

2. **Test AI Features**:
   - Run analysis on real job postings
   - Verify match scores make sense
   - Check PDF generation works
   - Ensure insights are accurate

3. **Prepare Demo Script**:
   ```
   Story: "I'm a student with 20 internship tabs open..."
   → Show messy browser
   → Open NOMA
   → Upload resume
   → Browse internships (real GitHub data!)
   → Select Tesla ML Intern
   → Click "Tweak Resume" → AI analyzes
   → Show match score: 87%
   → Show matched skills (green) vs missing (red)
   → Download beautiful PDF resume
   → Show dashboard with tracked apps
   → "Now I'm organized and optimized!"
   ```

---

## 📦 Dependencies (28 packages)

### Core (7)
- express, mongoose, dotenv, cors
- bcryptjs, jsonwebtoken
- axios

### File Processing (3)
- multer, pdf-parse, mammoth

### AI & PDF (2)
- @google/generative-ai
- puppeteer

### Dev (1)
- nodemon

---

## 🎬 Ready for Frontend?

Backend is **COMPLETE** ✅

Next steps:
1. Build Next.js frontend
2. Create beautiful UI components
3. Connect to these APIs
4. Add charts and visualizations
5. Polish and demo!

---

**Questions? Check:**
- `API_DOCUMENTATION.md` - All endpoints
- `BACKEND_COMPLETE.md` - Feature overview
- `README.md` - Technical details

---

**Let's build the frontend now! 🚀**


