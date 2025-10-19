# NOMA Frontend - AI-Powered Internship Organizer

Modern, sleek web application for organizing internship applications with AI-powered resume optimization.

## 🎨 Design Philosophy

- **Pure Black Background** - Minimalist, professional aesthetic
- **Subtle Interactions** - Smooth animations and transitions
- **Typography-First** - Clean, readable interface with excellent hierarchy
- **Responsive Design** - Works beautifully on all devices

## 🚀 Features

### ✅ Completed

1. **Landing Page** - Modern hero section with feature showcase
2. **Authentication** - Login and register pages with form validation
3. **Dashboard Home** - Analytics, charts, and insights overview
4. **Internship Explorer** - Browse and search internship listings
5. **My Tracker** - Personal tracker table with status management
6. **Resume Library** - Upload and manage resume versions
7. **AI Resume Tweak Modal** - Before/after comparison with match scores
8. **Reminder System** - Date/time picker for application reminders

### 🔄 Todo

- **Backend Integration** - Connect all pages to API endpoints
- **File Upload** - Implement actual resume upload functionality
- **Real-time Updates** - WebSocket for notifications
- **Export Features** - Download tweaked resumes as PDF

## 📂 Project Structure

```
noma.frontend/
├── app/
│   ├── auth/
│   │   ├── login/         # Login page
│   │   └── register/      # Registration page
│   ├── dashboard/
│   │   ├── internships/   # Explore internships
│   │   ├── tracker/       # My tracker table
│   │   ├── resumes/       # Resume library
│   │   ├── layout.tsx     # Auth protection
│   │   └── page.tsx       # Dashboard home
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/
│   ├── DashboardLayout.tsx    # Main dashboard layout with sidebar
│   ├── ResumeTweakModal.tsx   # AI resume optimization modal
│   └── ReminderModal.tsx      # Reminder date picker modal
└── lib/
    ├── axios.ts           # API client configuration
    └── store.ts           # Zustand state management
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **State Management**: Zustand
- **Icons**: Lucide React
- **HTTP Client**: Axios

## 🎯 User Workflow

1. **Landing** → User visits homepage, sees features
2. **Sign Up/Login** → Creates account or logs in
3. **Dashboard** → Views analytics and upcoming deadlines
4. **Explore Internships** → Browses GitHub-sourced listings
5. **Add to Tracker** → Saves interesting opportunities
6. **Upload Resume** → Uploads base resume
7. **AI Tweak** → Optimizes resume for specific roles
8. **Set Reminders** → Creates application reminders
9. **Apply** → Opens application links
10. **Track Progress** → Monitors application status

## 🚦 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔗 API Endpoints (Backend Integration Pending)

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/resume/upload` - Upload resume
- `GET /api/resume` - List user resumes
- `GET /api/internships` - List internships
- `POST /api/tracker` - Add to tracker
- `GET /api/tracker` - Get tracked internships
- `POST /api/tweak` - Generate AI-tweaked resume
- `GET /api/dashboard` - Get dashboard stats

## 🎨 Color Palette

- **Background**: Pure Black (#000000)
- **Borders**: White with 5-20% opacity
- **Cards**: White with 2% opacity
- **Accents**: Blue (#6366f1), Purple (#a855f7), Green (#10b981)
- **Text**: White (primary), Gray-400 (secondary), Gray-500 (tertiary)

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## ✨ Key UX Features

- **Smooth Animations** - Framer Motion for delightful interactions
- **Loading States** - Skeleton screens and spinners
- **Error Handling** - User-friendly error messages
- **Form Validation** - Real-time validation feedback
- **Toast Notifications** - Non-intrusive success/error alerts
- **Keyboard Navigation** - Accessible for all users
- **Dark Mode Native** - Optimized for dark mode viewing

## 🔒 Authentication Flow

1. User enters credentials
2. Frontend sends POST to `/api/auth/login`
3. Backend returns JWT token
4. Token stored in localStorage & Zustand
5. Token sent with all subsequent requests
6. Protected routes check for token
7. Redirect to login if unauthorized

## 📊 State Management

Using Zustand for:
- **Auth State**: User info, token
- **Resume State**: Uploaded resumes, selected resume
- **Internship State**: Listings, tracked internships

## 🎭 Component Patterns

- **Server Components**: Default for better performance
- **Client Components**: Interactive UI with `'use client'`
- **Layouts**: Shared UI with nested routes
- **Modals**: Portal-based with Framer Motion
- **Forms**: Controlled components with validation

## 🚀 Performance Optimizations

- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Next.js Image component
- **Font Optimization**: Next.js Font with Geist
- **Lazy Loading**: React.lazy for heavy components
- **Memoization**: useMemo/useCallback where needed

## 📝 Notes

- All mock data will be replaced with real API calls
- Backend integration is the final step
- Focus on UX and visual polish first
- API client is configured and ready to use

## 🎉 Credits

Built with ❤️ for students hunting internships!
