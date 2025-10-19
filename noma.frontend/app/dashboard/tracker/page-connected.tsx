'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ExternalLink, Trash2, Calendar, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { trackerAPI, TrackedInternship, ApplicationStatus } from '@/lib/api/tracker';
import ReminderModal from '@/components/ReminderModal';
import ResumeTweakModal from '@/components/ResumeTweakModal';

export default function TrackerPage() {
  const [trackedInternships, setTrackedInternships] = useState<TrackedInternship[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reminderModal, setReminderModal] = useState<{ open: boolean; internship: any } | null>(null);
  const [tweakModal, setTweakModal] = useState<{ open: boolean; internship: any } | null>(null);

  useEffect(() => {
    loadTrackedInternships();
  }, []);

  const loadTrackedInternships = async () => {
    try {
      setIsLoading(true);
      const result = await trackerAPI.getAll();
      setTrackedInternships(result.tracked);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load tracked internships');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: ApplicationStatus) => {
    try {
      await trackerAPI.update(id, { status: newStatus });
      setTrackedInternships(prev =>
        prev.map(item => (item._id === id ? { ...item, status: newStatus } : item))
      );
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this from your tracker?')) return;

    try {
      setDeletingId(id);
      await trackerAPI.delete(id);
      setTrackedInternships(prev => prev.filter(item => item._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

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

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400">Loading your tracker...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Tracker</h1>
          <p className="text-gray-400">Manage and track your internship applications</p>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {['all', 'apply-later', 'applied', 'interview', 'offer', 'rejected'].map((status) => {
            const isActive = selectedStatus === status;
            const count = getStatusCount(status);
            const label = status === 'all' ? 'All' : statusConfig[status as ApplicationStatus].label;

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
                {filteredInternships.map((item, index) => (
                  <motion.tr
                    key={item._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium">{item.internship?.company || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-400">{item.internship?.role || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-400">{item.internship?.location || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4">
                      {item.internship?.deadline ? (
                        <>
                          <div className="text-sm">{new Date(item.internship.deadline).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-600">
                            {Math.ceil((new Date(item.internship.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                          </div>
                        </>
                      ) : (
                        <span className="text-sm text-gray-600">No deadline</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item._id, e.target.value as ApplicationStatus)}
                        className={`
                          inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer
                          bg-transparent focus:outline-none
                          ${statusConfig[item.status].color}
                        `}
                      >
                        <option value="apply-later">Apply Later</option>
                        <option value="applied">Applied</option>
                        <option value="interview">Interview</option>
                        <option value="offer">Offer</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setTweakModal({ open: true, internship: item.internship })}
                        className="px-3 py-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg text-xs font-medium hover:bg-purple-500/20 transition-all flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3 h-3" />
                        Tweak Resume
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setReminderModal({ open: true, internship: item.internship })}
                          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <Calendar className="w-4 h-4 text-gray-500" />
                        </button>
                        <a
                          href={item.internship?.applyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-gray-500" />
                        </a>
                        <button
                          onClick={() => handleDelete(item._id)}
                          disabled={deletingId === item._id}
                          className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deletingId === item._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
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
              <p className="text-gray-500 mb-4">No internships in this status.</p>
              <p className="text-sm text-gray-600">Add internships from the Explorer page</p>
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

      {/* Modals */}
      {reminderModal && (
        <ReminderModal
          isOpen={reminderModal.open}
          onClose={() => setReminderModal(null)}
          internship={reminderModal.internship}
        />
      )}

      {tweakModal && (
        <ResumeTweakModal
          isOpen={tweakModal.open}
          onClose={() => setTweakModal(null)}
          internship={tweakModal.internship}
        />
      )}
    </DashboardLayout>
  );
}


