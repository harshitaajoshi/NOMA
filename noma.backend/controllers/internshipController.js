import Internship from '../models/Internship.js';
import { syncInternshipsToDatabase } from '../services/githubService.js';

/**
 * @desc    Get all internships (with pagination and filters)
 * @route   GET /api/internships
 * @access  Public
 */
export const getAllInternships = async (req, res) => {
  try {
    const { page = 1, limit = 20, location, company, tags } = req.query;

    // Build filter query
    const filter = { isActive: true };
    
    if (location && location !== 'all') {
      filter.location = new RegExp(location, 'i'); // Case-insensitive
    }
    
    if (company) {
      filter.company = new RegExp(company, 'i');
    }
    
    if (tags) {
      filter.tags = { $in: tags.split(',') };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch internships
    const internships = await Internship.find(filter)
      .sort({ lastUpdated: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count for pagination
    const total = await Internship.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: internships.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: { internships }
    });
  } catch (error) {
    console.error('Get internships error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching internships',
      error: error.message
    });
  }
};

/**
 * @desc    Search internships
 * @route   GET /api/internships/search
 * @access  Public
 */
export const searchInternships = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query'
      });
    }

    // Text search across company, role, and location
    const internships = await Internship.find({
      $text: { $search: q },
      isActive: true
    })
      .sort({ score: { $meta: 'textScore' } })
      .limit(50);

    res.status(200).json({
      success: true,
      count: internships.length,
      data: { internships }
    });
  } catch (error) {
    console.error('Search internships error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching internships',
      error: error.message
    });
  }
};

/**
 * @desc    Get single internship by ID
 * @route   GET /api/internships/:id
 * @access  Public
 */
export const getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { internship }
    });
  } catch (error) {
    console.error('Get internship error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching internship',
      error: error.message
    });
  }
};

/**
 * @desc    Refresh internships from GitHub
 * @route   POST /api/internships/refresh
 * @access  Private (admin only for production, public for MVP)
 */
export const refreshInternships = async (req, res) => {
  try {
    const result = await syncInternshipsToDatabase(Internship);

    res.status(200).json({
      success: true,
      message: 'Internships refreshed successfully',
      data: result
    });
  } catch (error) {
    console.error('Refresh internships error:', error);
    res.status(500).json({
      success: false,
      message: 'Error refreshing internships from GitHub',
      error: error.message
    });
  }
};

/**
 * @desc    Get internship statistics
 * @route   GET /api/internships/stats
 * @access  Public
 */
export const getInternshipStats = async (req, res) => {
  try {
    const totalActive = await Internship.countDocuments({ isActive: true });
    
    const locationStats = await Internship.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const tagStats = await Internship.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalActive,
        topLocations: locationStats,
        topTags: tagStats
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};


