'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Calendar, ExternalLink, Plus, RefreshCw } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

export default function InternshipsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Mock data - will be replaced with real data from backend
  const internships = [
    {
      id: '1',
      company: 'Tesla',
      role: 'Machine Learning Intern',
      location: 'Austin, TX',
      deadline: '2025-11-15',
      description: 'Work on cutting-edge AI projects for autonomous driving.',
      applyLink: 'https://tesla.com/careers',
      type: 'ML/AI',
    },
    {
      id: '2',
      company: 'Google',
      role: 'Software Engineering Intern',
      location: 'Mountain View, CA',
      deadline: '2025-11-18',
      description: 'Build scalable systems that impact billions of users.',
      applyLink: 'https://google.com/careers',
      type: 'Engineering',
    },
    {
      id: '3',
      company: 'Meta',
      role: 'Data Science Intern',
      location: 'Menlo Park, CA',
      deadline: '2025-11-22',
      description: 'Analyze data to drive product decisions.',
      applyLink: 'https://meta.com/careers',
      type: 'Data Science',
    },
    {
      id: '4',
      company: 'Microsoft',
      role: 'Cloud Engineer Intern',
      location: 'Redmond, WA',
      deadline: '2025-11-25',
      description: 'Build and maintain Azure infrastructure.',
      applyLink: 'https://microsoft.com/careers',
      type: 'Engineering',
    },
    {
      id: '5',
      company: 'Apple',
      role: 'iOS Development Intern',
      location: 'Cupertino, CA',
      deadline: '2025-11-28',
      description: 'Create amazing experiences for millions of iOS users.',
      applyLink: 'https://apple.com/careers',
      type: 'Engineering',
    },
    {
      id: '6',
      company: 'Amazon',
      role: 'Frontend Engineering Intern',
      location: 'Seattle, WA',
      deadline: '2025-12-01',
      description: 'Build user-facing features for Amazon\'s products.',
      applyLink: 'https://amazon.com/careers',
      type: 'Engineering',
    },
  ];

  const types = ['All Types', 'Engineering', 'ML/AI', 'Data Science', 'Product'];
  const locations = ['All Locations', 'Remote', 'CA', 'WA', 'TX', 'NY'];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Explore Internships</h1>
            <p className="text-gray-400">Discover and track internship opportunities</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-all text-sm">
            <RefreshCw className="w-4 h-4" />
            Refresh Listings
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company, role, or tech stack..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-white/30 transition-colors"
          >
            {types.map((type) => (
              <option key={type} value={type.toLowerCase()}>
                {type}
              </option>
            ))}
          </select>

          {/* Location Filter */}
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-white/30 transition-colors"
          >
            {locations.map((location) => (
              <option key={location} value={location.toLowerCase()}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-400">
          Showing <span className="text-white font-medium">{internships.length}</span> internships
        </div>

        {/* Internships Grid */}
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
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold">{internship.company}</h3>
                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded-full">
                      {internship.type}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{internship.role}</p>
                </div>
              </div>

              {/* Location & Deadline */}
              <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{internship.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{internship.deadline}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-400 mb-6 line-clamp-2">
                {internship.description}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-200 transition-all">
                  <Plus className="w-4 h-4" />
                  Add to My List
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
      </div>
    </DashboardLayout>
  );
}

