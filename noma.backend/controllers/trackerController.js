import TrackedInternship from '../models/TrackedInternship.js';
import Internship from '../models/Internship.js';

/**
 * @desc    Add internship to user's tracker
 * @route   POST /api/tracker
 * @access  Private
 */
export const addToTracker = async (req, res) => {
  try {
    const { internshipId, status = 'saved', notes, remindDate } = req.body;

    // Validate internship exists
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    // Check if already tracking
    const existing = await TrackedInternship.findOne({
      userId: req.user._id,
      internshipId
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You are already tracking this internship'
      });
    }

    // Create tracked internship
    const tracked = await TrackedInternship.create({
      userId: req.user._id,
      internshipId,
      status,
      notes,
      remindDate: remindDate ? new Date(remindDate) : null
    });

    // Populate internship details
    await tracked.populate('internshipId');

    res.status(201).json({
      success: true,
      message: 'Internship added to tracker',
      data: { tracked }
    });
  } catch (error) {
    console.error('Add to tracker error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding internship to tracker',
      error: error.message
    });
  }
};

/**
 * @desc    Get all tracked internships for user
 * @route   GET /api/tracker
 * @access  Private
 */
export const getUserTrackedInternships = async (req, res) => {
  try {
    const { status } = req.query;

    // Build filter
    const filter = { userId: req.user._id };
    if (status) {
      filter.status = status;
    }

    // Fetch tracked internships with full internship details
    const trackedInternships = await TrackedInternship.find(filter)
      .populate('internshipId')
      .sort({ addedAt: -1 });

    res.status(200).json({
      success: true,
      count: trackedInternships.length,
      data: { trackedInternships }
    });
  } catch (error) {
    console.error('Get tracked internships error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tracked internships',
      error: error.message
    });
  }
};

/**
 * @desc    Get single tracked internship
 * @route   GET /api/tracker/:id
 * @access  Private
 */
export const getTrackedInternshipById = async (req, res) => {
  try {
    const tracked = await TrackedInternship.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('internshipId');

    if (!tracked) {
      return res.status(404).json({
        success: false,
        message: 'Tracked internship not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { tracked }
    });
  } catch (error) {
    console.error('Get tracked internship error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tracked internship',
      error: error.message
    });
  }
};

/**
 * @desc    Update tracked internship (status, notes, reminder)
 * @route   PATCH /api/tracker/:id
 * @access  Private
 */
export const updateTrackerStatus = async (req, res) => {
  try {
    const { status, notes, remindDate } = req.body;

    const tracked = await TrackedInternship.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!tracked) {
      return res.status(404).json({
        success: false,
        message: 'Tracked internship not found'
      });
    }

    // Update fields
    if (status) tracked.status = status;
    if (notes !== undefined) tracked.notes = notes;
    if (remindDate !== undefined) {
      tracked.remindDate = remindDate ? new Date(remindDate) : null;
    }

    // Set appliedAt if status changed to applied
    if (status === 'applied' && !tracked.appliedAt) {
      tracked.appliedAt = new Date();
    }

    await tracked.save();
    await tracked.populate('internshipId');

    res.status(200).json({
      success: true,
      message: 'Tracker updated successfully',
      data: { tracked }
    });
  } catch (error) {
    console.error('Update tracker error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating tracker',
      error: error.message
    });
  }
};

/**
 * @desc    Remove internship from tracker
 * @route   DELETE /api/tracker/:id
 * @access  Private
 */
export const removeFromTracker = async (req, res) => {
  try {
    const tracked = await TrackedInternship.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!tracked) {
      return res.status(404).json({
        success: false,
        message: 'Tracked internship not found'
      });
    }

    await TrackedInternship.deleteOne({ _id: tracked._id });

    res.status(200).json({
      success: true,
      message: 'Internship removed from tracker'
    });
  } catch (error) {
    console.error('Remove from tracker error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing from tracker',
      error: error.message
    });
  }
};

/**
 * @desc    Get upcoming reminders
 * @route   GET /api/tracker/reminders/upcoming
 * @access  Private
 */
export const getUpcomingReminders = async (req, res) => {
  try {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const reminders = await TrackedInternship.find({
      userId: req.user._id,
      remindDate: { $gte: today, $lte: nextWeek },
      status: { $in: ['saved', 'interview'] } // Exclude applied/rejected
    })
      .populate('internshipId')
      .sort({ remindDate: 1 });

    res.status(200).json({
      success: true,
      count: reminders.length,
      data: { reminders }
    });
  } catch (error) {
    console.error('Get reminders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reminders',
      error: error.message
    });
  }
};


