'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, FileText, Clock, TrendingUp, Calendar, Target, Loader2, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
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
              color: 'from-white/10 to-gray-500/10',
              iconColor: 'text-gray-300',
              borderColor: 'border-white/10',
            },
            {
              name: 'Applications',
              value: stats.appliedCount.toString(),
              icon: FileText,
              change: `${stats.totalTracked - stats.appliedCount} pending`,
              color: 'from-white/10 to-gray-500/10',
              iconColor: 'text-gray-300',
              borderColor: 'border-white/10',
            },
            {
              name: 'Reminders Set',
              value: stats.remindersSet.toString(),
              icon: Clock,
              change: `${stats.upcomingDeadlines.length} upcoming`,
              color: 'from-white/10 to-gray-500/10',
              iconColor: 'text-gray-300',
              borderColor: 'border-white/10',
            },
            {
              name: 'Avg Match Score',
              value: `${stats.avgMatchScore}%`,
              icon: TrendingUp,
              change: stats.avgMatchScore > 75 ? 'Excellent!' : 'Good',
              color: 'from-white/10 to-gray-500/10',
              iconColor: 'text-gray-300',
              borderColor: 'border-white/10',
            },
          ];

  const statusData = [
    { name: 'Saved', value: stats.statusBreakdown['apply-later'], color: '#6366f1', gradient: 'from-indigo-500 to-blue-500' },
    { name: 'Applied', value: stats.statusBreakdown.applied, color: '#10b981', gradient: 'from-emerald-500 to-green-500' },
    { name: 'Interview', value: stats.statusBreakdown.interview, color: '#f59e0b', gradient: 'from-amber-500 to-orange-500' },
    { name: 'Rejected', value: stats.statusBreakdown.rejected, color: '#ef4444', gradient: 'from-red-500 to-rose-500' },
  ];

  // Activity trend data with multiple metrics
  const activityTrend = [
    { 
      name: 'Week 1', 
      applications: stats.totalTracked > 0 ? Math.max(1, Math.floor(stats.totalTracked * 0.2)) : 0,
      interviews: stats.statusBreakdown.interview > 0 ? Math.floor(stats.statusBreakdown.interview * 0.3) : 0
    },
    { 
      name: 'Week 2', 
      applications: stats.totalTracked > 0 ? Math.max(1, Math.floor(stats.totalTracked * 0.4)) : 0,
      interviews: stats.statusBreakdown.interview > 0 ? Math.floor(stats.statusBreakdown.interview * 0.5) : 0
    },
    { 
      name: 'Week 3', 
      applications: stats.totalTracked > 0 ? Math.max(1, Math.floor(stats.totalTracked * 0.7)) : 0,
      interviews: stats.statusBreakdown.interview > 0 ? Math.floor(stats.statusBreakdown.interview * 0.8) : 0
    },
    { 
      name: 'Week 4', 
      applications: stats.totalTracked > 0 ? stats.totalTracked : 0,
      interviews: stats.statusBreakdown.interview
    },
  ];

  // Match score distribution
  const matchScoreData = [
    { range: '90-100%', count: stats.avgMatchScore >= 90 ? 1 : 0 },
    { range: '80-89%', count: stats.avgMatchScore >= 80 && stats.avgMatchScore < 90 ? 1 : 0 },
    { range: '70-79%', count: stats.avgMatchScore >= 70 && stats.avgMatchScore < 80 ? 1 : 0 },
    { range: '60-69%', count: stats.avgMatchScore >= 60 && stats.avgMatchScore < 70 ? 1 : 0 },
  ].filter(d => d.count > 0);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Welcome section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-white/[0.02] border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="relative z-10">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Welcome back!</span>
              <span className="ml-2">👋</span>
            </h1>
            <p className="text-gray-400">Here's what's happening with your internship applications.</p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden bg-white/[0.02] border ${stat.borderColor} rounded-xl p-6 hover:border-opacity-60 transition-all backdrop-blur-sm group`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1 text-white">{stat.value}</h3>
                <p className="text-sm text-gray-300 mb-1 font-medium">{stat.name}</p>
                <p className="text-xs text-gray-400">{stat.change}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Application Status - Bigger Pie Chart */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="relative overflow-hidden bg-white/[0.02] border border-white/10 rounded-xl p-6 backdrop-blur-sm"
                  >
                    <h3 className="text-lg font-semibold mb-6 text-white relative z-10">Application Status</h3>
            {statusData.some((d) => d.value > 0) ? (
              <>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={statusData.filter((d) => d.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        borderRadius: '12px',
                        color: '#fff',
                        backdropFilter: 'blur(12px)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2 relative z-10">
                  {statusData.map((item) => (
                    item.value > 0 && (
                      <div key={item.name} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${item.gradient}`} />
                          <span className="text-gray-200">{item.name}</span>
                        </div>
                        <span className="font-semibold text-white">{item.value}</span>
                      </div>
                    )
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <p className="text-sm">No applications yet</p>
                <p className="text-xs mt-1">Start tracking internships to see stats</p>
              </div>
            )}
          </motion.div>

                  {/* Activity Trend - Line Chart */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="relative overflow-hidden bg-white/[0.02] border border-white/10 rounded-xl p-6 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between mb-6 relative z-10">
                      <h3 className="text-lg font-semibold text-white">Application Progress</h3>
                      <Activity className="w-5 h-5 text-gray-400" />
                    </div>
            {stats.totalTracked > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={activityTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#6b7280"
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.9)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '12px',
                      color: '#fff',
                      backdropFilter: 'blur(12px)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="applications" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 5, strokeWidth: 2, stroke: '#065f46' }}
                    activeDot={{ r: 7 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="interviews" 
                    stroke="#f59e0b" 
                    strokeWidth={3}
                    dot={{ fill: '#f59e0b', r: 5, strokeWidth: 2, stroke: '#92400e' }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <p className="text-sm">No data yet</p>
                <p className="text-xs mt-1">Track internships to see your progress</p>
              </div>
            )}
          </motion.div>
        </div>

                {/* Upcoming Deadlines */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="relative overflow-hidden bg-white/[0.02] border border-white/10 rounded-xl p-6 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <h3 className="text-lg font-semibold text-white">Upcoming Deadlines</h3>
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
            {stats.upcomingDeadlines.length > 0 ? (
              <div className="space-y-3 relative z-10">
                {stats.upcomingDeadlines.slice(0, 5).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/10 rounded-lg hover:bg-white/[0.05] hover:border-white/20 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-gray-300" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{item.internship.company}</h4>
                        <p className="text-sm text-gray-400">{item.internship.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">
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

                {/* Recent Activity */}
                {stats.recentActivity.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="relative overflow-hidden bg-white/[0.02] border border-white/10 rounded-xl p-6 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between mb-6 relative z-10">
                      <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                      <Target className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="space-y-3 relative z-10">
                      {stats.recentActivity.slice(0, 5).map((item, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-3 hover:bg-white/[0.05] rounded-lg transition-all border border-transparent hover:border-white/20"
                        >
                          <div className="w-2 h-2 rounded-full bg-white/30 mt-2" />
                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="text-gray-400">{item.type}:</span>{' '}
                              <span className="font-medium text-white">{item.internship}</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
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


