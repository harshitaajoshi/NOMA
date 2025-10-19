'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, ExternalLink, Plus, RefreshCw, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { internshipAPI, Internship } from '@/lib/api/internship';
import { trackerAPI } from '@/lib/api/tracker';
import { useInternshipStore } from '@/lib/store';
import { ToastContainer } from '@/components/Toast';
import { useToast } from '@/hooks/useToast';

export default function InternshipsPage() {
  const { internships, setInternships } = useInternshipStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [addingId, setAddingId] = useState<string | null>(null);
  const { toasts, removeToast, success, error: showError } = useToast();

  useEffect(() => {
    loadInternships();
  }, []);

  const loadInternships = async () => {
    try {
      setIsLoading(true);
      setError('');
      const result = await internshipAPI.getAll();
      setInternships(result.internships);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load internships');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await internshipAPI.refresh();
      await loadInternships();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to refresh listings');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAddToTracker = async (internship: Internship) => {
    try {
      setAddingId(internship.id);
      await trackerAPI.add({
        internshipId: internship.id,
        status: 'saved',
      });
      success(`Added ${internship.company} to your tracker!`);
    } catch (err: any) {
      console.error('Add to tracker error:', err);
      showError(err.response?.data?.error || err.message || 'Failed to add to tracker');
    } finally {
      setAddingId(null);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadInternships();
      return;
    }

    try {
      setIsLoading(true);
      const result = await internshipAPI.search(searchQuery);
      setInternships(result.internships);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && internships.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400">Loading internships...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Explore Internships</h1>
            <p className="text-gray-400">Discover and track internship opportunities</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-all text-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Listings'}
          </button>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by company, role, or tech stack..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-2.5 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-200 transition-all"
          >
            Search
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Results Count */}
        <div className="text-sm text-gray-400">
          Showing <span className="text-white font-medium">{internships.length}</span> internships
        </div>

        {/* Internships Grid */}
        {internships.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {internships.map((internship, index) => (
              <motion.div
                key={internship.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/[0.02] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all group"
              >
                {/* Company & Role */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{internship.company}</h3>
                    <p className="text-gray-400 text-sm">{internship.role}</p>
                  </div>
                </div>

                {/* Location & Deadline */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{internship.location}</span>
                  </div>
                  {internship.deadline && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(internship.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {internship.description && (
                  <p className="text-sm text-gray-400 mb-6 line-clamp-2">
                    {internship.description}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAddToTracker(internship)}
                    disabled={addingId === internship.id}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-200 transition-all disabled:opacity-50"
                  >
                    {addingId === internship.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Add to My List
                      </>
                    )}
                  </button>
                  <a
                    href={internship.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white/[0.02] border border-white/10 rounded-xl">
            <p className="text-gray-400 mb-4">No internships found</p>
            <button
              onClick={loadInternships}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-all text-sm"
            >
              Reload
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

