'use client';

import { motion } from 'framer-motion';
import { Briefcase, FileText, Clock, TrendingUp, Calendar, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DashboardLayout from '@/components/DashboardLayout';

export default function DashboardPage() {
  // Mock data - will be replaced with real data from backend
  const stats = [
    { name: 'Total Internships', value: '12', icon: Briefcase, change: '+3 this week', color: 'from-blue-500 to-cyan-500' },
    { name: 'Applications', value: '5', icon: FileText, change: '2 pending', color: 'from-purple-500 to-pink-500' },
    { name: 'Reminders Set', value: '4', icon: Clock, change: '1 today', color: 'from-orange-500 to-red-500' },
    { name: 'Avg Match Score', value: '87%', icon: TrendingUp, change: '+5% improved', color: 'from-green-500 to-emerald-500' },
  ];

  const applicationData = [
    { name: 'Jan', applications: 4, deadlines: 2 },
    { name: 'Feb', applications: 3, deadlines: 5 },
    { name: 'Mar', applications: 7, deadlines: 4 },
    { name: 'Apr', applications: 5, deadlines: 6 },
    { name: 'May', applications: 8, deadlines: 3 },
  ];

  const statusData = [
    { name: 'Apply Later', value: 7, color: '#6366f1' },
    { name: 'Applied', value: 3, color: '#10b981' },
    { name: 'Interview', value: 1, color: '#f59e0b' },
    { name: 'Rejected', value: 1, color: '#ef4444' },
  ];

  const upcomingDeadlines = [
    { company: 'Tesla', role: 'ML Intern', deadline: '2025-11-15', daysLeft: 3 },
    { company: 'Google', role: 'SWE Intern', deadline: '2025-11-18', daysLeft: 6 },
    { company: 'Meta', role: 'Data Science Intern', deadline: '2025-11-22', daysLeft: 10 },
  ];

  const recentActivity = [
    { action: 'Added to tracker', company: 'NVIDIA', time: '2 hours ago' },
    { action: 'Resume tweaked', company: 'Microsoft', time: '5 hours ago' },
    { action: 'Applied', company: 'Amazon', time: '1 day ago' },
    { action: 'Reminder set', company: 'Apple', time: '2 days ago' },
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
          {stats.map((stat, index) => (
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
          {/* Application Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white/[0.02] border border-white/10 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold mb-6">Application Timeline</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={applicationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#000',
                    border: '1px solid #ffffff20',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="applications" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="deadlines" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Status Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/[0.02] border border-white/10 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold mb-6">Application Status</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusData}
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
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-400">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Deadlines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/[0.02] border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Upcoming Deadlines</h3>
              <Calendar className="w-5 h-5 text-gray-500" />
            </div>
            <div className="space-y-4">
              {upcomingDeadlines.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/10 rounded-lg hover:border-white/20 transition-all"
                >
                  <div>
                    <h4 className="font-medium">{item.company}</h4>
                    <p className="text-sm text-gray-400">{item.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{item.daysLeft} days left</p>
                    <p className="text-xs text-gray-500">{item.deadline}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/[0.02] border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <Target className="w-5 h-5 text-gray-500" />
            </div>
            <div className="space-y-4">
              {recentActivity.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-3 hover:bg-white/[0.02] rounded-lg transition-all"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="text-gray-400">{item.action}:</span>{' '}
                      <span className="font-medium">{item.company}</span>
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}

