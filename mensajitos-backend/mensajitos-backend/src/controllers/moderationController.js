const Report = require('../models/Report');
const Message = require('../models/Message');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
  try {
    const pendingReports = await Report.countDocuments({ status: 'pending' });
    const totalReports = await Report.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalMessages = await Message.countDocuments();

    res.json({
      pendingReports,
      totalReports,
      totalUsers,
      totalMessages
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRecentReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('reporter', 'name')
      .populate('reportedUser', 'name')
      .populate('message', 'content');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.body;
    await Message.findByIdAndDelete(messageId);
    res.json({ message: 'Mensaje eliminado exitosamente' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
