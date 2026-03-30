const mongoose = require('mongoose');

const expoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: { type: String, required: true },
  theme: { type: String },
  capacity: { type: Number, default: 500 },
  boothCount: { type: Number, default: 50 },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
  image: { type: String },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  registeredAttendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expo', expoSchema);
