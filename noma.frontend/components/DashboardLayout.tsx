'use client';

import { ReactNode, useState, useEffect as React_useEffect } from 'react';
import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Briefcase,
  ListChecks,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
} from 'lucide-react';
import NotificationPanel from './NotificationPanel';
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Explore Internships', href: '/dashboard/internships', icon: Briefcase },
  { name: 'My Tracker', href: '/dashboard/tracker', icon: ListChecks },
  { name: 'Resume Library', href: '/dashboard/resumes', icon: FileText },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const handleBackHome = () => {
    router.push('/');
  };

  // Check for notifications
  React.useEffect(() => {
    checkNotifications();
    // Refresh notification count every 30 seconds
    const interval = setInterval(checkNotifications, 30000);
    return () => clearInterval(interval);
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
    <div className="min-h-screen bg-black text-white">
      {/* Background grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      {/* Sidebar for desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col z-50">
        <div className="flex flex-col flex-grow border-r border-white/5 bg-black/95 backdrop-blur-xl">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-white/5">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-xl font-semibold tracking-tight">NOMA</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`
                        group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all
                        ${
                          isActive
                            ? 'bg-white/10 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }
                      `}
                    >
                      <item.icon
                        className={`mr-3 h-5 w-5 flex-shrink-0 ${
                          isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-400'
                        }`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
          </nav>

          {/* User section */}
          <div className="border-t border-white/5 p-4">
            <button
              onClick={handleBackHome}
              className="w-full flex items-center px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Back to Home
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-64 z-50 lg:hidden"
            >
              <div className="flex flex-col h-full border-r border-white/5 bg-black/95 backdrop-blur-xl">
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-white/5">
                  <span className="text-xl font-semibold tracking-tight">NOMA</span>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-1 hover:bg-white/5 rounded-md transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1">
                      {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`
                              group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all
                              ${
                                isActive
                                  ? 'bg-white/10 text-white'
                                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                              }
                            `}
                          >
                            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                            {item.name}
                          </Link>
                        );
                      })}
                </nav>

                {/* User section */}
                <div className="border-t border-white/5 p-4">
                  <button
                    onClick={handleBackHome}
                    className="w-full flex items-center px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Back to Home
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/5 bg-black/95 backdrop-blur-xl px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-white/5 rounded-md transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="search"
                placeholder="Search internships..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
          </div>

          {/* Notifications */}
          <button 
            onClick={() => setShowNotifications(true)}
            className="relative p-2 hover:bg-white/5 rounded-md transition-colors group"
          >
            <Bell className="h-5 w-5 group-hover:text-purple-400 transition-colors" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>
        </header>

            {/* Page content */}
            <main className="relative">
              {children}
            </main>
      </div>

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </div>
  );
}

