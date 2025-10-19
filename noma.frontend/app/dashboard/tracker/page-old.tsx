'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ExternalLink, Trash2, Calendar, MoreVertical } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

type Status = 'apply-later' | 'applied' | 'interview' | 'offer' | 'rejected';

interface TrackedInternship {
  id: string;
  company: string;
  role: string;
  location: string;
  deadline: string;
  status: Status;
  addedDate: string;
  applyLink: string;
  hasResumeTweak?: boolean;
  matchScore?: number;
}

export default function TrackerPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Mock data - will be replaced with real data from backend
  const [trackedInternships, setTrackedInternships] = useState<TrackedInternship[]>([
    {
      id: '1',
      company: 'Tesla',
      role: 'ML Intern',
      location: 'Austin, TX',
      deadline: '2025-11-15',
      status: 'apply-later',
      addedDate: '2025-10-15',
      applyLink: 'https://tesla.com/careers',
      hasResumeTweak: true,
      matchScore: 92,
    },
    {
      id: '2',
      company: 'Google',
      role: 'SWE Intern',
      location: 'Mountain View, CA',
      deadline: '2025-11-18',
      status: 'applied',
      addedDate: '2025-10-12',
      applyLink: 'https://google.com/careers',
      hasResumeTweak: true,
      matchScore: 87,
    },
    {
      id: '3',
      company: 'Meta',
      role: 'Data Science Intern',
      location: 'Menlo Park, CA',
      deadline: '2025-11-22',
      status: 'interview',
      addedDate: '2025-10-10',
      applyLink: 'https://meta.com/careers',
      hasResumeTweak: false,
    },
    {
      id: '4',
      company: 'Microsoft',
      role: 'Cloud Engineer Intern',
      location: 'Redmond, WA',
      deadline: '2025-11-25',
      status: 'apply-later',
      addedDate: '2025-10-18',
      applyLink: 'https://microsoft.com/careers',
    },
  ]);

  const statusConfig = {
    'apply-later': { label: 'Apply Later', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    'applied': { label: 'Applied', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
    'interview': { label: 'Interview', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
    'offer': { label: 'Offer', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    'rejected': { label: 'Rejected', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  };

  const filteredInternships = selectedStatus === 'all'
    ? trackedInternships
    : trackedInternships.filter((i) => i.status === selectedStatus);

  const getStatusCount = (status: string) => {
    if (status === 'all') return trackedInternships.length;
    return trackedInternships.filter((i) => i.status === status).length;
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Tracker</h1>
          <p className="text-gray-400">Manage and track your internship applications</p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {['all', 'apply-later', 'applied', 'interview', 'offer', 'rejected'].map((status) => {
            const isActive = selectedStatus === status;
            const count = getStatusCount(status);
            const label = status === 'all' ? 'All' : statusConfig[status as Status].label;

            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                  ${isActive
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                  }
                `}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Company</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Role</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Location</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Deadline</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Resume</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInternships.map((internship, index) => (
                  <motion.tr
                    key={internship.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium">{internship.company}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-400">{internship.role}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-400">{internship.location}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{internship.deadline}</div>
                      <div className="text-xs text-gray-600">3 days left</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`
                          inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                          ${statusConfig[internship.status].color}
                        `}
                      >
                        {statusConfig[internship.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {internship.hasResumeTweak ? (
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg text-xs font-medium hover:bg-purple-500/20 transition-all">
                          <Sparkles className="w-3 h-3" />
                          {internship.matchScore}% Match
                        </button>
                      ) : (
                        <button className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-medium hover:border-white/20 transition-all">
                          Tweak Resume
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                          <Calendar className="w-4 h-4 text-gray-500" />
                        </button>
                        <a
                          href={internship.applyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-gray-500" />
                        </a>
                        <button className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredInternships.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No internships found in this status.</p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
            <p className="text-sm text-gray-400 mb-1">Total Tracked</p>
            <p className="text-2xl font-bold">{trackedInternships.length}</p>
          </div>
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
            <p className="text-sm text-gray-400 mb-1">Applied</p>
            <p className="text-2xl font-bold text-green-400">{getStatusCount('applied')}</p>
          </div>
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
            <p className="text-sm text-gray-400 mb-1">Pending</p>
            <p className="text-2xl font-bold text-blue-400">{getStatusCount('apply-later')}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

