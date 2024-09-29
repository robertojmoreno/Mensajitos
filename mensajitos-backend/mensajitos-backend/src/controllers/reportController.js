const Report = require('../models/Report');
const Message = require('../models/Message');

exports.createReport = async (req, res) => {
  try {
    const { messageId, reason } = req.body;
    const report = new Report({
      reporter: req.user._id,
      message: messageId,
      reason
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
      .populate('message', 'content');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateReportStatus = async (req, res) => {
  try {
    const { reportId, status } = req.body;
    const report = await Report.findByIdAndUpdate(reportId, { status }, { new: true });
    res.json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
