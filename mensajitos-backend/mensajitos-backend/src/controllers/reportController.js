const Report = require('../models/Report');
const Message = require('../models/Message');
const User = require('../models/User');

exports.createReport = async (req, res) => {
  try {
    const { messageId, reason, description } = req.body;
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Mensaje no encontrado' });
    }

    const report = new Report({
      reporter: req.user._id,
      reportedUser: message.creator,
      message: messageId,
      reason,
      description
    });

    await report.save();
    res.status(201).json({ message: 'Reporte creado exitosamente' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('reporter', 'name')
      .populate('reportedUser', 'name')
      .populate('message', 'content');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateReportStatus = async (req, res) => {
  try {
    const { reportId, status, moderatorNotes } = req.body;
    const report = await Report.findByIdAndUpdate(reportId, 
      { 
        status, 
        moderatorNotes,
        resolvedBy: req.user._id 
      }, 
      { new: true }
    );
    res.json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
