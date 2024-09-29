const User = require('../models/User');
const Message = require('../models/Message');
const Report = require('../models/Report');

exports.getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalMessages = await Message.countDocuments();
    const totalReports = await Report.countDocuments();

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const newUsersLastMonth = await User.countDocuments({ createdAt: { $gte: lastMonth } });
    const newMessagesLastMonth = await Message.countDocuments({ createdAt: { $gte: lastMonth } });

    res.json({
      totalUsers,
      activeUsers,
      totalMessages,
      totalReports,
      newUsersLastMonth,
      newMessagesLastMonth
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCreatorStats = async (req, res) => {
  try {
    const creatorId = req.params.id;
    const messages = await Message.find({ creator: creatorId });
    
    const totalMessages = messages.length;
    const totalLikes = messages.reduce((sum, message) => sum + message.likes, 0);
    const totalShares = messages.reduce((sum, message) => sum + message.shares, 0);
    
    const user = await User.findById(creatorId);
    const followerCount = user.followers.length;

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const recentMessages = messages.filter(message => message.createdAt >= lastMonth);
    const recentLikes = recentMessages.reduce((sum, message) => sum + message.likes, 0);
    const recentShares = recentMessages.reduce((sum, message) => sum + message.shares, 0);

    res.json({
      totalMessages,
      totalLikes,
      totalShares,
      followerCount,
      recentMessages: recentMessages.length,
      recentLikes,
      recentShares
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getContentTrends = async (req, res) => {
  try {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const trendingMessages = await Message.aggregate([
      { $match: { createdAt: { $gte: lastWeek } } },
      { $project: {
          content: 1,
          category: 1,
          engagementScore: { $add: ['$likes', '$shares'] }
        }
      },
      { $sort: { engagementScore: -1 } },
      { $limit: 10 }
    ]);

    const categoryTrends = await Message.aggregate([
      { $match: { createdAt: { $gte: lastWeek } } },
      { $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalLikes: { $sum: '$likes' },
          totalShares: { $sum: '$shares' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      trendingMessages,
      categoryTrends
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserEngagement = async (req, res) => {
  try {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const activeUsers = await User.countDocuments({ lastLogin: { $gte: lastMonth } });
    
    const messageEngagement = await Message.aggregate([
      { $match: { createdAt: { $gte: lastMonth } } },
      { $group: {
          _id: null,
          totalLikes: { $sum: '$likes' },
          totalShares: { $sum: '$shares' },
          totalMessages: { $sum: 1 }
        }
      }
    ]);

    const averageLikesPerMessage = messageEngagement[0].totalLikes / messageEngagement[0].totalMessages;
    const averageSharesPerMessage = messageEngagement[0].totalShares / messageEngagement[0].totalMessages;

    res.json({
      activeUsers,
      totalLikes: messageEngagement[0].totalLikes,
      totalShares: messageEngagement[0].totalShares,
      averageLikesPerMessage,
      averageSharesPerMessage
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTopCreators = async (req, res) => {
  try {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const topCreators = await Message.aggregate([
      { $match: { createdAt: { $gte: lastMonth } } },
      { $group: {
          _id: '$creator',
          totalMessages: { $sum: 1 },
          totalLikes: { $sum: '$likes' },
          totalShares: { $sum: '$shares' }
        }
      },
      { $sort: { totalLikes: -1 } },
      { $limit: 10 },
      { $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'creatorInfo'
        }
      },
      { $unwind: '$creatorInfo' },
      { $project: {
          _id: 1,
          name: '$creatorInfo.name',
          avatar: '$creatorInfo.avatar',
          totalMessages: 1,
          totalLikes: 1,
          totalShares: 1
        }
      }
    ]);

    res.json(topCreators);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMostActiveUsers = async (req, res) => {
  try {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const mostActiveUsers = await User.aggregate([
      { $match: { lastLogin: { $gte: lastMonth } } },
      { $project: {
          name: 1,
          avatar: 1,
          totalActions: { $add: [
            { $size: '$messages' },
            { $size: '$likes' },
            { $size: '$shares' }
          ]}
        }
      },
      { $sort: { totalActions: -1 } },
      { $limit: 10 }
    ]);

    res.json(mostActiveUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFeatured = async (req, res) => {
  try {
    const topCreators = await exports.getTopCreators(req, res);
    const mostActiveUsers = await exports.getMostActiveUsers(req, res);

    res.json({
      topCreators: topCreators.slice(0, 3),  // Podio de creadores
      mostActiveUsers: mostActiveUsers.slice(0, 3),  // Podio de usuarios activos
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWeeklyTopCreators = async (req, res) => {
  try {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const topCreators = await Message.aggregate([
      { $match: { createdAt: { $gte: lastWeek } } },
      { $group: {
          _id: '$creator',
          totalMessages: { $sum: 1 },
          totalLikes: { $sum: '$likes' },
          totalShares: { $sum: '$shares' }
        }
      },
      { $addFields: {
          score: { $add: ['$totalLikes', { $multiply: ['$totalShares', 2] }] }
        }
      },
      { $sort: { score: -1 } },
      { $limit: 10 },
      { $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'creatorInfo'
        }
      },
      { $unwind: '$creatorInfo' },
      { $project: {
          _id: 1,
          name: '$creatorInfo.name',
          avatar: '$creatorInfo.avatar',
          totalMessages: 1,
          totalLikes: 1,
          totalShares: 1,
          score: 1
        }
      }
    ]);

    // Actualizar el historial de creador y el ranking
    for (let i = 0; i < topCreators.length; i++) {
      const creator = topCreators[i];
      await User.findByIdAndUpdate(creator._id, {
        $push: {
          creatorHistory: {
            week: new Date(),
            rank: i + 1,
            score: creator.score
          }
        },
        $inc: { ranking: 10 - i }  // Aumenta el ranking basado en la posición
      });
    }

    res.json(topCreators);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserBadges = async (req, res) => {
  try {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const activeUsers = await User.aggregate([
      { $lookup: {
          from: 'messages',
          localField: '_id',
          foreignField: 'creator',
          as: 'messages'
        }
      },
      { $project: {
          _id: 1,
          name: 1,
          commentCount: { $size: { $filter: {
            input: '$messages',
            as: 'message',
            cond: { $gte: ['$$message.createdAt', lastWeek] }
          }}},
          likeCount: { $sum: { $filter: {
            input: '$messages',
            as: 'message',
            cond: { $gte: ['$$message.createdAt', lastWeek] },
            in: '$$message.likes'
          }}},
          shareCount: { $sum: { $filter: {
            input: '$messages',
            as: 'message',
            cond: { $gte: ['$$message.createdAt', lastWeek] },
            in: '$$message.shares'
          }}}
        }
      }
    ]);

    for (const user of activeUsers) {
      const badges = [];
      if (user.commentCount >= 20) badges.push('active_commenter');
      if (user.shareCount >= 15) badges.push('frequent_sharer');
      if (user.likeCount >= 50) badges.push('top_liker');

      await User.findByIdAndUpdate(user._id, { $addToSet: { badges: { $each: badges } } });
    }

    res.json({ message: 'Insignias de usuarios actualizadas exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};