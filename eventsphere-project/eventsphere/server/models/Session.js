const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  expo: { type: mongoose.Schema.Types.ObjectId, ref: 'Expo', required: true },
  title: { type: String, required: true },
  description: { type: String },
  speaker: { type: String },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  location: { type: String },
  capacity: { type: Number, default: 100 },
  type: { type: String, enum: ['keynote', 'workshop', 'panel', 'presentation'], default: 'presentation' },
  registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', sessionSchema);
