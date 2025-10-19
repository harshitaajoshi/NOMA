# NOMA Backend API

AI-powered internship organizer and resume optimizer backend.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

Required variables:
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `GEMINI_API_KEY` - Google Gemini API key

### 3. Run Development Server
```bash
npm run dev
```

The server will start at `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints (Coming Soon)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/resume/upload` - Upload resume
- `GET /api/internships` - Fetch internships
- `POST /api/tweak` - AI resume tweaking

## 🛠️ Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **AI:** Google Gemini API
- **Auth:** JWT + bcryptjs
- **File Processing:** Multer, pdf-parse, mammoth
- **PDF Generation:** Puppeteer

## 📁 Project Structure
```
noma.backend/
├── config/          # Configuration files (DB, etc.)
├── models/          # Mongoose schemas
├── routes/          # API routes
├── controllers/     # Route handlers
├── middleware/      # Auth, error handling
├── services/        # Business logic (Gemini, GitHub, PDF)
├── utils/           # Helper functions
├── templates/       # PDF templates
└── server.js        # Entry point
```

## 🔐 Security
- Passwords hashed with bcryptjs
- JWT-based authentication
- CORS configured for frontend only
- Environment variables for secrets

## 📝 Development
- Run `npm run dev` for auto-restart on changes
- Use Postman/Thunder Client to test endpoints
- Check logs for MongoDB connection status

---

Built with ❤️ for students struggling with job applications


