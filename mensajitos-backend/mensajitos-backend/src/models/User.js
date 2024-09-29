const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  firebaseUid: {
    type: String,
    required: true,
    unique: true
  },
  bio: String,
  avatar: String,
  role: {
    type: String,
    enum: ['user', 'creator', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  fcmToken: String,
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  interests: [String],
  creatorHistory: [{
    week: Date,
    rank: Number,
    score: Number
  }],
  badges: [{
    type: String,
    enum: ['active_commenter', 'frequent_sharer', 'top_liker', 'weekly_creator']
  }],
  ranking: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
