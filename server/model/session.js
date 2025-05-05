const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  duration: { type: Number }, // in minutes
  completed: { type: Boolean, default: false },
  distractions: [{
    type: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    note: { type: String }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', SessionSchema);