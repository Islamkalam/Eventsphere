const mongoose = require('mongoose');

const exhibitorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expo: { type: mongoose.Schema.Types.ObjectId, ref: 'Expo', required: true },
  companyName: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  products: [{ type: String }],
  logo: { type: String },
  website: { type: String },
  boothNumber: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  contactEmail: { type: String },
  contactPhone: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Exhibitor', exhibitorSchema);
