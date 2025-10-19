'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, FileText, Clock, TrendingUp, Calendar, Target, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DashboardLayout from '@/components/DashboardLayout';
import { dashboardAPI, DashboardStats } from '@/lib/api/dashboard';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const result = await dashboardAPI.getStats();
      setStats(result.stats);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
            <p className="text-red-400">{error}</p>
            <button
              onClick={loadDashboardData}
              className="mt-4 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      name: 'Total Internships',
      value: stats.totalTracked.toString(),
      icon: Briefcase,
      change: `${stats.totalTracked} tracked`,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Applications',
      value: stats.appliedCount.toString(),
      icon: FileText,
      change: `${stats.totalTracked - stats.appliedCount} pending`,
      color: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Reminders Set',
      value: stats.remindersSet.toString(),
      icon: Clock,
      change: `${stats.upcomingDeadlines.length} upcoming`,
      color: 'from-orange-500 to-red-500',
    },
    {
      name: 'Avg Match Score',
      value: `${stats.avgMatchScore}%`,
      icon: TrendingUp,
      change: stats.avgMatchScore > 75 ? 'Excellent!' : 'Good',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const statusData = [
    { name: 'Apply Later', value: stats.statusBreakdown['apply-later'], color: '#6366f1' },
    { name: 'Applied', value: stats.statusBreakdown.applied, color: '#10b981' },
    { name: 'Interview', value: stats.statusBreakdown.interview, color: '#f59e0b' },
    { name: 'Rejected', value: stats.statusBreakdown.rejected, color: '#ef4444' },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Welcome section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back! 👋</h1>
          <p className="text-gray-400">Here's what's happening with your internship applications.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/[0.02] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-10 flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-400 mb-1">{stat.name}</p>
              <p className="text-xs text-gray-500">{stat.change}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/[0.02] border border-white/10 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold mb-6">Application Status</h3>
            {statusData.some((d) => d.value > 0) ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={statusData.filter((d) => d.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#000',
                        border: '1px solid #ffffff20',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {statusData.map((item) => (
                    item.value > 0 && (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-gray-400">{item.name}</span>
                        </div>
                        <span className="font-medium">{item.value}</span>
                      </div>
                    )
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p className="text-sm">No applications yet</p>
                <p className="text-xs mt-1">Start tracking internships to see stats</p>
              </div>
            )}
          </motion.div>

          {/* Upcoming Deadlines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 bg-white/[0.02] border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Upcoming Deadlines</h3>
              <Calendar className="w-5 h-5 text-gray-500" />
            </div>
            {stats.upcomingDeadlines.length > 0 ? (
              <div className="space-y-4">
                {stats.upcomingDeadlines.slice(0, 5).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/10 rounded-lg hover:border-white/20 transition-all"
                  >
                    <div>
                      <h4 className="font-medium">{item.internship.company}</h4>
                      <p className="text-sm text-gray-400">{item.internship.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {item.daysLeft} {item.daysLeft === 1 ? 'day' : 'days'} left
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(item.internship.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p className="text-sm">No upcoming deadlines</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Recent Activity */}
        {stats.recentActivity.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/[0.02] border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <Target className="w-5 h-5 text-gray-500" />
            </div>
            <div className="space-y-4">
              {stats.recentActivity.slice(0, 5).map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-3 hover:bg-white/[0.02] rounded-lg transition-all"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="text-gray-400">{item.type}:</span>{' '}
                      <span className="font-medium">{item.internship}</span>
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}


