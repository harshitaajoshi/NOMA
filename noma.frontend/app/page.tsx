'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Target, TrendingUp, Zap, Bell } from 'lucide-react';
import Link from 'next/link';
import NotificationPanel from '@/components/NotificationPanel';

export default function LandingPage() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const { scrollYProgress } = useScroll();
  
  // Transform scroll progress to gradient position
  const gradientY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const gradientRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  // Check for notifications on page load
  useEffect(() => {
    checkNotifications();
  }, []);

  const checkNotifications = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/notifications/count');
      const data = await response.json();
      setNotificationCount(data.count || 0);
    } catch (error) {
      console.error('Failed to check notifications:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Subtle background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      {/* Animated gradient overlay - Organic smoky effect */}
      <motion.div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 800px 600px at 20% ${gradientY}, rgba(100, 100, 100, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 600px 800px at 80% calc(100% - ${gradientY}), rgba(80, 80, 80, 0.12) 0%, transparent 50%),
            radial-gradient(circle 500px at 50% 50%, rgba(120, 120, 120, 0.08) 0%, transparent 70%)
          `,
          filter: 'blur(80px)',
        }}
      />
      <motion.div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 700px 500px at 60% ${gradientY}, rgba(90, 90, 90, 0.1) 0%, transparent 60%),
            radial-gradient(ellipse 500px 700px at 30% calc(50% + ${gradientY}), rgba(110, 110, 110, 0.08) 0%, transparent 60%)
          `,
          filter: 'blur(100px)',
        }}
      />

      {/* Celestial elements - stars and dots */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Left side celestials */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] left-[8%] w-1 h-1 bg-white rounded-full shadow-[0_0_8px_2px_rgba(255,255,255,0.5)]"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.3, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[35%] left-[5%] w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_3px_rgba(255,255,255,0.4)]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.7, 0.4], rotate: [0, 360] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute top-[55%] left-[10%] w-2 h-2"
        >
          <div className="absolute inset-0 bg-white/40 rounded-full blur-[1px]" />
          <svg className="w-full h-full" viewBox="0 0 24 24">
            <path fill="white" d="M12 0l1.5 8.5L22 12l-8.5 1.5L12 22l-1.5-8.5L2 12l8.5-1.5z" opacity="0.6" />
          </svg>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[75%] left-[7%] w-1 h-1 bg-white rounded-full shadow-[0_0_6px_2px_rgba(255,255,255,0.5)]"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.2, 1] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-[25%] left-[12%] w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_4px_1px_rgba(255,255,255,0.6)]"
        />

        {/* Right side celestials */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-[20%] right-[8%] w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_3px_rgba(255,255,255,0.4)]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.8, 0.4], rotate: [0, -360] }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          className="absolute top-[42%] right-[6%] w-2.5 h-2.5"
        >
          <div className="absolute inset-0 bg-white/30 rounded-full blur-[2px]" />
          <svg className="w-full h-full" viewBox="0 0 24 24">
            <path fill="white" d="M12 0l1.5 8.5L22 12l-8.5 1.5L12 22l-1.5-8.5L2 12l8.5-1.5z" opacity="0.7" />
          </svg>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.3, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute top-[62%] right-[10%] w-1 h-1 bg-white rounded-full shadow-[0_0_8px_2px_rgba(255,255,255,0.5)]"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
          className="absolute top-[82%] right-[7%] w-1 h-1 bg-white rounded-full shadow-[0_0_6px_2px_rgba(255,255,255,0.6)]"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.2, 1] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[10%] right-[12%] w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_4px_1px_rgba(255,255,255,0.7)]"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.15, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          className="absolute top-[48%] right-[14%] w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_5px_1px_rgba(255,255,255,0.5)]"
        />

        {/* Star Constellations - Left Side */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[28%] left-[6%]"
        >
          {/* Triangle pattern */}
          <svg width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="5" r="1" fill="white" opacity="0.6" />
            <circle cx="10" cy="30" r="0.8" fill="white" opacity="0.5" />
            <circle cx="30" cy="30" r="0.8" fill="white" opacity="0.5" />
            <line x1="20" y1="5" x2="10" y2="30" stroke="white" strokeWidth="0.3" opacity="0.2" />
            <line x1="20" y1="5" x2="30" y2="30" stroke="white" strokeWidth="0.3" opacity="0.2" />
            <line x1="10" y1="30" x2="30" y2="30" stroke="white" strokeWidth="0.3" opacity="0.2" />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[68%] left-[9%]"
        >
          {/* Mini dipper pattern */}
          <svg width="50" height="30" viewBox="0 0 50 30">
            <circle cx="5" cy="15" r="1" fill="white" opacity="0.6" />
            <circle cx="15" cy="10" r="0.7" fill="white" opacity="0.5" />
            <circle cx="25" cy="8" r="0.8" fill="white" opacity="0.6" />
            <circle cx="35" cy="12" r="0.7" fill="white" opacity="0.5" />
            <circle cx="45" cy="18" r="0.6" fill="white" opacity="0.4" />
            <line x1="5" y1="15" x2="15" y2="10" stroke="white" strokeWidth="0.3" opacity="0.2" />
            <line x1="15" y1="10" x2="25" y2="8" stroke="white" strokeWidth="0.3" opacity="0.2" />
            <line x1="25" y1="8" x2="35" y2="12" stroke="white" strokeWidth="0.3" opacity="0.2" />
            <line x1="35" y1="12" x2="45" y2="18" stroke="white" strokeWidth="0.3" opacity="0.2" />
          </svg>
        </motion.div>

        {/* Star Constellations - Right Side */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-[32%] right-[7%]"
        >
          {/* Diamond pattern */}
          <svg width="35" height="35" viewBox="0 0 35 35">
            <circle cx="17.5" cy="5" r="0.8" fill="white" opacity="0.6" />
            <circle cx="5" cy="17.5" r="0.7" fill="white" opacity="0.5" />
            <circle cx="30" cy="17.5" r="0.7" fill="white" opacity="0.5" />
            <circle cx="17.5" cy="30" r="0.8" fill="white" opacity="0.6" />
            <line x1="17.5" y1="5" x2="5" y2="17.5" stroke="white" strokeWidth="0.3" opacity="0.2" />
            <line x1="17.5" y1="5" x2="30" y2="17.5" stroke="white" strokeWidth="0.3" opacity="0.2" />
            <line x1="5" y1="17.5" x2="17.5" y2="30" stroke="white" strokeWidth="0.3" opacity="0.2" />
            <line x1="30" y1="17.5" x2="17.5" y2="30" stroke="white" strokeWidth="0.3" opacity="0.2" />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[15%] right-[9%]"
        >
          {/* W shape pattern */}
          <svg width="45" height="25" viewBox="0 0 45 25">
            <circle cx="5" cy="20" r="0.8" fill="white" opacity="0.6" />
            <circle cx="15" cy="5" r="0.7" fill="white" opacity="0.5" />
            <circle cx="22.5" cy="15" r="0.7" fill="white" opacity="0.5" />
            <circle cx="30" cy="5" r="0.7" fill="white" opacity="0.5" />
            <circle cx="40" cy="20" r="0.8" fill="white" opacity="0.6" />
            <line x1="5" y1="20" x2="15" y2="5" stroke="white" strokeWidth="0.3" opacity="0.2" />
            <line x1="15" y1="5" x2="22.5" y2="15" stroke="white" strokeWidth="0.3" opacity="0.2" />
            <line x1="22.5" y1="15" x2="30" y2="5" stroke="white" strokeWidth="0.3" opacity="0.2" />
            <line x1="30" y1="5" x2="40" y2="20" stroke="white" strokeWidth="0.3" opacity="0.2" />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute top-[72%] right-[8%]"
        >
          {/* Cross pattern */}
          <svg width="30" height="30" viewBox="0 0 30 30">
            <circle cx="15" cy="15" r="1" fill="white" opacity="0.7" />
            <circle cx="15" cy="5" r="0.6" fill="white" opacity="0.5" />
            <circle cx="25" cy="15" r="0.6" fill="white" opacity="0.5" />
            <circle cx="15" cy="25" r="0.6" fill="white" opacity="0.5" />
            <circle cx="5" cy="15" r="0.6" fill="white" opacity="0.5" />
            <line x1="15" y1="15" x2="15" y2="5" stroke="white" strokeWidth="0.3" opacity="0.2" />
            <line x1="15" y1="15" x2="25" y2="15" stroke="white" strokeWidth="0.3" opacity="0.2" />
            <line x1="15" y1="15" x2="15" y2="25" stroke="white" strokeWidth="0.3" opacity="0.2" />
            <line x1="15" y1="15" x2="5" y2="15" stroke="white" strokeWidth="0.3" opacity="0.2" />
          </svg>
        </motion.div>
      </div>
      
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto px-6 py-8 flex items-center justify-between border-b border-white/5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <span className="text-2xl font-semibold tracking-tight">NOMA</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <button
              onClick={() => setShowNotifications(true)}
              className="relative p-2.5 hover:bg-white/5 rounded-md transition-colors group"
            >
              <Bell className="h-6 w-6 group-hover:text-gray-300 transition-colors" />
              {notificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>
            <Link
              href="/dashboard"
              className="px-5 py-2.5 bg-white text-black rounded-md text-base font-medium hover:bg-gray-100 transition-all"
            >
              Open Dashboard
            </Link>
          </motion.div>
        </nav>

        {/* Hero Section */}
        <div className="container mx-auto px-6 pt-32 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-8"
            >
              <div className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm backdrop-blur-sm font-medium text-gray-300">
                ✨ AI-Powered Internship Intelligence
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-[1.1] tracking-tight">
              Your internship hunt,
              <br />
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                supercharged.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed font-medium">
              Apply. Organize. Evolve. All in Noma.
            </p>

            <p className="text-base md:text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Stop juggling spreadsheets and browser tabs. NOMA transforms chaos into clarity—track 1400+ internships, AI-optimize your resume for every role, and never miss a deadline again.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/dashboard"
                className="group px-10 py-4 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition-all text-lg shadow-lg flex items-center gap-2"
              >
                Start Organizing Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/dashboard/internships"
                className="px-10 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 hover:border-white/20 transition-all text-lg backdrop-blur-sm"
              >
                Explore 1400+ Internships
              </Link>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-16 flex items-center justify-center gap-8 text-sm text-gray-500"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
                <span>1400+ Live Opportunities</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-gray-700 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-gray-400" />
                <span>AI-Powered Optimization</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-gray-700 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-gray-400" />
                <span>Zero Applications Missed</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Features */}
        <div className="container mx-auto px-6 py-32 border-y border-white/5">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-block mb-6 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm backdrop-blur-sm font-medium text-gray-300">
              🚀 Your Secret Weapon
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Everything you need.
              <br />
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Nothing you don't.
              </span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              From discovering opportunities to landing offers, NOMA transforms your internship hunt into a strategic, data-driven process.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Target className="w-6 h-6" />}
              title="1. Apply Smarter"
              description="1400+ live internships at your fingertips. Auto-synced, constantly updated, perfectly organized. One click to add to your tracker."
              delay={0}
            />
            <FeatureCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="2. Organize Everything"
              description="Spreadsheet chaos? Gone. Beautiful dashboard shows deadlines, statuses, and insights. Your entire pipeline in one clean view."
              delay={0.1}
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="3. Evolve With AI"
              description="Upload once, optimize infinitely. AI tweaks your resume for every role, calculates match scores, and tells you exactly what to fix."
              delay={0.2}
            />
          </div>
        </div>

        {/* What You'll Get Section */}
        <div className="container mx-auto px-6 py-32">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-6 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm backdrop-blur-sm font-medium text-gray-300">
              💎 The Complete Arsenal
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Six tools that change
              <br />
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                everything.
              </span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              From discovery to offer letter, NOMA is your unfair advantage in the internship game.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="group bg-white/[0.02] border border-white/10 rounded-2xl p-8 hover:bg-white/[0.04] hover:border-white/20 transition-all">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Smart Discovery</h3>
              <p className="text-gray-400 leading-relaxed">
                1400+ curated opportunities at your fingertips. Auto-synced, constantly updated, ready to apply—no more endless searching.
              </p>
            </div>
            <div className="group bg-white/[0.02] border border-white/10 rounded-2xl p-8 hover:bg-white/[0.04] hover:border-white/20 transition-all">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Visual Intelligence</h3>
              <p className="text-gray-400 leading-relaxed">
                Turn raw data into beautiful insights. Track progress, spot patterns, optimize strategy with charts that actually make sense.
              </p>
            </div>
            <div className="group bg-white/[0.02] border border-white/10 rounded-2xl p-8 hover:bg-white/[0.04] hover:border-white/20 transition-all">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">AI Optimization</h3>
              <p className="text-gray-400 leading-relaxed">
                Stop sending generic resumes. AI analyzes every job, scores your match, suggests exactly what to change to stand out.
              </p>
            </div>
            <div className="group bg-white/[0.02] border border-white/10 rounded-2xl p-8 hover:bg-white/[0.04] hover:border-white/20 transition-all">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Total Organization</h3>
              <p className="text-gray-400 leading-relaxed">
                Ditch the spreadsheets. Track applications, manage statuses, set reminders—everything in one clean dashboard.
              </p>
            </div>
            <div className="group bg-white/[0.02] border border-white/10 rounded-2xl p-8 hover:bg-white/[0.04] hover:border-white/20 transition-all">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Resume Library</h3>
              <p className="text-gray-400 leading-relaxed">
                One base resume, infinite versions. Store, manage, and access all your optimized resumes in one organized place.
              </p>
            </div>
            <div className="group bg-white/[0.02] border border-white/10 rounded-2xl p-8 hover:bg-white/[0.04] hover:border-white/20 transition-all">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Zero Missed Deadlines</h3>
              <p className="text-gray-400 leading-relaxed">
                Set it, forget it. Smart reminders ensure you never miss an application deadline, follow-up, or interview—ever.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-6 py-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-white/[0.02] border border-white/10 rounded-3xl p-12 md:p-20 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="relative z-10">
              <div className="inline-block mb-6 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm backdrop-blur-sm font-medium text-gray-300">
                ⚡ Join the Movement
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
                Stop wishing.
                <br />
                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Start landing.
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Your dream internship isn't going to find itself. NOMA gives you the tools, intelligence, and organization to make it happen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/dashboard"
                  className="group px-10 py-4 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition-all text-lg shadow-lg flex items-center gap-2"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <p className="text-sm text-gray-500 mt-6">No credit card required. Start organizing in 30 seconds.</p>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-12 border-t border-white/5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold tracking-tight">NOMA</span>
            <p className="text-gray-500">
              © 2025 NOMA. All rights reserved.
            </p>
          </div>
      </footer>
      </div>

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="group p-8 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/20 transition-all duration-300"
    >
      <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-3 tracking-tight">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}
