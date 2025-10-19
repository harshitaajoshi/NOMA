import TrackedInternship from '../models/TrackedInternship.js';
import TweakedResume from '../models/TweakedResume.js';
import Resume from '../models/Resume.js';
import Internship from '../models/Internship.js';

/**
 * @desc    Get dashboard statistics and analytics
 * @route   GET /api/dashboard
 * @access  Private
 */
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Total internships tracked
    const totalInternshipsTracked = await TrackedInternship.countDocuments({ userId });

    // Count by status
    const statusCounts = await TrackedInternship.aggregate([
      { $match: { userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const statusMap = {};
    statusCounts.forEach(item => {
      statusMap[item._id] = item.count;
    });

    const appliedCount = statusMap.applied || 0;
    const savedCount = statusMap.saved || 0;
    const interviewCount = statusMap.interview || 0;
    const rejectedCount = statusMap.rejected || 0;
    const offerCount = statusMap.offer || 0;

    // Upcoming deadlines (next 7 days)
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const upcomingDeadlines = await TrackedInternship.find({
      userId,
      remindDate: { $gte: today, $lte: nextWeek },
      status: { $ne: 'applied' }
    })
      .populate('internshipId')
      .sort({ remindDate: 1 })
      .limit(5);

    // Average match score from tweaked resumes
    const avgScoreResult = await TweakedResume.aggregate([
      { $match: { userId } },
      { $group: { _id: null, avgScore: { $avg: '$matchScore' } } }
    ]);
    const avgMatchScore = avgScoreResult.length > 0 ? Math.round(avgScoreResult[0].avgScore) : 0;

    // Recent activity (last 10 actions)
    const recentTracked = await TrackedInternship.find({ userId })
      .populate('internshipId')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentTweaked = await TweakedResume.find({ userId })
      .populate(['internshipId'])
      .sort({ createdAt: -1 })
      .limit(5);

    const recentActivity = [
      ...recentTracked.map(t => ({
        type: 'tracked',
        action: `Added ${t.internshipId?.company} to tracker`,
        date: t.createdAt,
        internship: t.internshipId
      })),
      ...recentTweaked.map(t => ({
        type: 'tweaked',
        action: `Tweaked resume for ${t.internshipId?.company}`,
        date: t.createdAt,
        score: t.matchScore,
        internship: t.internshipId
      }))
    ].sort((a, b) => b.date - a.date).slice(0, 10);

    // Applications by week (for chart)
    const applicationsByWeek = await getApplicationsTimeline(userId);

    // Total resumes uploaded
    const totalResumes = await Resume.countDocuments({ userId });

    // Total tweaked resumes
    const totalTweaked = await TweakedResume.countDocuments({ userId });

    // Success rate (offers / applied)
    const successRate = appliedCount > 0 ? Math.round((offerCount / appliedCount) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalInternshipsTracked,
          appliedCount,
          savedCount,
          interviewCount,
          rejectedCount,
          offerCount,
          totalResumes,
          totalTweaked,
          avgMatchScore,
          successRate
        },
        upcomingDeadlines: upcomingDeadlines.map(d => ({
          id: d._id,
          internship: d.internshipId,
          remindDate: d.remindDate,
          status: d.status,
          daysUntil: Math.ceil((new Date(d.remindDate) - today) / (1000 * 60 * 60 * 24))
        })),
        recentActivity,
        applicationsByWeek
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

/**
 * Helper: Get applications timeline grouped by week
 */
const getApplicationsTimeline = async (userId) => {
  try {
    const tracked = await TrackedInternship.find({
      userId,
      status: { $in: ['applied', 'interview', 'offer', 'rejected'] },
      appliedAt: { $exists: true }
    }).sort({ appliedAt: 1 });

    // Group by week
    const weeklyData = {};
    tracked.forEach(app => {
      const date = new Date(app.appliedAt);
      const weekStart = getWeekStart(date);
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = {
          week: weekKey,
          count: 0,
          applied: 0,
          interview: 0,
          offer: 0,
          rejected: 0
        };
      }

      weeklyData[weekKey].count++;
      weeklyData[weekKey][app.status]++;
    });

    // Convert to array and sort
    return Object.values(weeklyData).sort((a, b) => 
      new Date(a.week) - new Date(b.week)
    );
  } catch (error) {
    console.error('Timeline error:', error);
    return [];
  }
};

/**
 * Helper: Get start of week (Sunday)
 */
const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};

/**
 * @desc    Get match score insights
 * @route   GET /api/dashboard/insights
 * @access  Private
 */
export const getMatchScoreInsights = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all tweaked resumes
    const tweaked = await TweakedResume.find({ userId })
      .populate('internshipId')
      .sort({ matchScore: -1 });

    if (tweaked.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          message: 'No tweaked resumes yet',
          recommendations: []
        }
      });
    }

    // Calculate insights
    const scores = tweaked.map(t => t.matchScore);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);

    // Top 5 best matches
    const topMatches = tweaked.slice(0, 5).map(t => ({
      company: t.internshipId.company,
      role: t.internshipId.role,
      score: t.matchScore,
      strengths: t.strengths.slice(0, 2)
    }));

    // Most common missing skills
    const missingSkillsMap = {};
    tweaked.forEach(t => {
      t.missingSkills.forEach(skill => {
        if (!missingSkillsMap[skill.skill]) {
          missingSkillsMap[skill.skill] = { count: 0, importance: skill.importance };
        }
        missingSkillsMap[skill.skill].count++;
      });
    });

    const topMissingSkills = Object.entries(missingSkillsMap)
      .map(([skill, data]) => ({ skill, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        scoreStats: {
          average: Math.round(avgScore),
          highest: maxScore,
          lowest: minScore,
          total: tweaked.length
        },
        topMatches,
        topMissingSkills,
        recommendations: generateRecommendations(avgScore, topMissingSkills)
      }
    });
  } catch (error) {
    console.error('Insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching insights',
      error: error.message
    });
  }
};

/**
 * Helper: Generate personalized recommendations
 */
const generateRecommendations = (avgScore, missingSkills) => {
  const recommendations = [];

  if (avgScore < 60) {
    recommendations.push({
      priority: 'high',
      message: 'Your average match score is below 60%. Focus on adding missing skills to your resume.',
      action: 'Add skills'
    });
  }

  if (missingSkills.length > 0) {
    recommendations.push({
      priority: 'medium',
      message: `Top missing skill: ${missingSkills[0].skill}. Consider adding projects or experience with this technology.`,
      action: 'Learn skill'
    });
  }

  if (avgScore >= 80) {
    recommendations.push({
      priority: 'low',
      message: 'Great! Your resumes are well-matched. Keep applying to increase your chances.',
      action: 'Apply more'
    });
  }

  return recommendations;
};


