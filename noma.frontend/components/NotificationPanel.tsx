'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Calendar, Sparkles, TrendingUp, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '@/lib/axios';
import Link from 'next/link';

interface Notification {
  id: string;
  type: 'deadline' | 'reminder' | 'suggestion' | 'new_internship';
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
  timestamp: string;
  data?: any;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      
      // Fetch tracked internships and reminders
      const trackerResponse = await api.get('/tracker');
      const tracked = trackerResponse.data.tracked || [];
      
      // Fetch internships
      const internshipsResponse = await api.get('/internships');
      const allInternships = internshipsResponse.data.internships || [];
      
      // Fetch resumes
      const resumeResponse = await api.get('/resumes');
      const resumes = resumeResponse.data.resumes || [];
      
      // Fetch tweaked resumes
      const tweakedResponse = await api.get('/tweak');
      const tweaked = tweakedResponse.data.tweaked || [];

      const generatedNotifications: Notification[] = [];

      // 1. Upcoming Deadlines (next 7 days)
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      tracked.forEach((item: any) => {
        if (item.internship?.deadline) {
          const deadline = new Date(item.internship.deadline);
          if (deadline >= today && deadline <= nextWeek) {
            const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            generatedNotifications.push({
              id: `deadline-${item.id}`,
              type: 'deadline',
              title: `Deadline in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`,
              message: `${item.internship.company} - ${item.internship.role}`,
              actionUrl: '/dashboard/tracker',
              actionText: 'View in Tracker',
              timestamp: deadline.toISOString(),
              data: item
            });
          }
        }
      });

      // 2. Upcoming Reminders (next 3 days)
      tracked.forEach((item: any) => {
        if (item.remindDate) {
          const reminderDate = new Date(item.remindDate);
          const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
          
          if (reminderDate >= today && reminderDate <= threeDaysFromNow) {
            const daysLeft = Math.ceil((reminderDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            generatedNotifications.push({
              id: `reminder-${item.id}`,
              type: 'reminder',
              title: `Reminder: ${daysLeft === 0 ? 'Today' : `In ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`}`,
              message: `Apply to ${item.internship?.company} - ${item.internship?.role}`,
              actionUrl: '/dashboard/tracker',
              actionText: 'Go to Tracker',
              timestamp: reminderDate.toISOString(),
              data: item
            });
          }
        }
      });

      // 3. Suggested Actions (tracked but not applied, no AI optimization yet)
      const notApplied = tracked.filter((item: any) => item.status === 'saved' || item.status === 'interested');
      
      if (notApplied.length > 0 && resumes.length > 0) {
        // Find internships without AI optimization
        const withoutOptimization = notApplied.filter((item: any) => {
          return !tweaked.some((t: any) => t.internshipId === item.internshipId);
        }).slice(0, 2); // Show max 2 suggestions

        withoutOptimization.forEach((item: any) => {
          generatedNotifications.push({
            id: `suggest-${item.id}`,
            type: 'suggestion',
            title: 'Optimize your resume?',
            message: `Get AI insights for ${item.internship?.company} - ${item.internship?.role}`,
            actionUrl: '/dashboard/tracker',
            actionText: 'Optimize Now',
            timestamp: new Date().toISOString(),
            data: item
          });
        });
      }

      // 4. New Internships (last 3 days - top 3)
      const threeDaysAgo = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);
      const newInternships = allInternships
        .filter((intern: any) => {
          if (!intern.datePosted) return false;
          const postedDate = new Date(intern.datePosted);
          return postedDate >= threeDaysAgo;
        })
        .slice(0, 3);

      newInternships.forEach((intern: any) => {
        generatedNotifications.push({
          id: `new-${intern.id}`,
          type: 'new_internship',
          title: '🆕 New Internship Posted',
          message: `${intern.company} - ${intern.role}`,
          actionUrl: '/dashboard/internships',
          actionText: 'View All',
          timestamp: intern.datePosted,
          data: intern
        });
      });

      // Sort by timestamp (newest first)
      generatedNotifications.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setNotifications(generatedNotifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'deadline':
        return <AlertCircle className="w-5 h-5 text-gray-300" />;
      case 'reminder':
        return <Bell className="w-5 h-5 text-gray-300" />;
      case 'suggestion':
        return <Sparkles className="w-5 h-5 text-gray-300" />;
      case 'new_internship':
        return <TrendingUp className="w-5 h-5 text-gray-300" />;
      default:
        return <CheckCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'deadline':
        return 'border-white/10 bg-white/[0.02]';
      case 'reminder':
        return 'border-white/10 bg-white/[0.02]';
      case 'suggestion':
        return 'border-white/10 bg-white/[0.02]';
      case 'new_internship':
        return 'border-white/10 bg-white/[0.02]';
      default:
        return 'border-white/10 bg-white/[0.02]';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-black border-l border-white/10 z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-gray-300" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Notifications</h2>
                  <p className="text-xs text-gray-400">Stay on top of your applications</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-12 h-12 border-2 border-white/20 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading notifications...</p>
                  </div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                    <Bell className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                  <p className="text-sm text-gray-400 max-w-xs">
                    You have no new notifications. Keep tracking internships to stay updated.
                  </p>
                  <Link
                    href="/dashboard/internships"
                    onClick={onClose}
                    className="mt-6 px-4 py-2 bg-white text-black rounded-lg text-sm hover:bg-gray-100 transition-all font-medium"
                  >
                    Explore Internships
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notif, index) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`border rounded-xl p-4 ${getNotificationColor(notif.type)}`}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm mb-1">{notif.title}</h4>
                          <p className="text-xs text-gray-400 mb-3">{notif.message}</p>
                          {notif.actionUrl && (
                            <Link
                              href={notif.actionUrl}
                              onClick={onClose}
                              className="inline-flex items-center gap-1.5 text-xs font-medium text-white hover:text-gray-300 transition-colors"
                            >
                              {notif.actionText}
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02]">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{notifications.length} notification{notifications.length !== 1 ? 's' : ''}</span>
                  <button
                    onClick={onClose}
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

