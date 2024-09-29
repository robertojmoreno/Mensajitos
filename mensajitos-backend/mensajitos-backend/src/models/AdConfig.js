const mongoose = require('mongoose');

const adConfigSchema = new mongoose.Schema({
  adUnitId: {
    type: String,
    required: true
  },
  adType: {
    type: String,
    enum: ['banner', 'interstitial', 'rewarded'],
    required: true
  },
  frequency: {
    type: Number,
    default: 5 // Por ejemplo, mostrar cada 5 acciones
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('AdConfig', adConfigSchema);
