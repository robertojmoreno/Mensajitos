const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    required: true
  },
  reason: {
    type: String,
    required: true,
    enum: ['spam', 'offensive', 'inappropriate', 'other']
  },
  description: String,
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved'],
    default: 'pending'
  },
  moderatorNotes: String,
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
