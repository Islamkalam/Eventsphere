const express = require('express');
const Expo = require('../models/Expo');
const { auth, adminOnly } = require('../middleware/auth');
const router = express.Router();

// Get all expos (public)
router.get('/', async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};
    if (status) query.status = status;
    if (search) query.title = { $regex: search, $options: 'i' };
    const expos = await Expo.find(query).populate('organizer', 'name email').sort({ date: 1 });
    res.json(expos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single expo
router.get('/:id', async (req, res) => {
  try {
    const expo = await Expo.findById(req.params.id)
      .populate('organizer', 'name email')
      .populate('registeredAttendees', 'name email');
    if (!expo) return res.status(404).json({ message: 'Expo not found' });
    res.json(expo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create expo (admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const expo = new Expo({ ...req.body, organizer: req.user._id });
    await expo.save();
    res.status(201).json(expo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update expo (admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const expo = await Expo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!expo) return res.status(404).json({ message: 'Expo not found' });
    res.json(expo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete expo (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await Expo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expo deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Register as attendee
router.post('/:id/register', auth, async (req, res) => {
  try {
    const expo = await Expo.findById(req.params.id);
    if (!expo) return res.status(404).json({ message: 'Expo not found' });
    if (expo.registeredAttendees.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already registered' });
    }
    expo.registeredAttendees.push(req.user._id);
    await expo.save();
    res.json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Analytics (admin only)
router.get('/:id/analytics', auth, adminOnly, async (req, res) => {
  try {
    const expo = await Expo.findById(req.params.id);
    if (!expo) return res.status(404).json({ message: 'Expo not found' });
    const Exhibitor = require('../models/Exhibitor');
    const Session = require('../models/Session');
    const exhibitorCount = await Exhibitor.countDocuments({ expo: req.params.id });
    const sessions = await Session.find({ expo: req.params.id });
    res.json({
      totalAttendees: expo.registeredAttendees.length,
      totalExhibitors: exhibitorCount,
      totalSessions: sessions.length,
      capacity: expo.capacity,
      fillRate: ((expo.registeredAttendees.length / expo.capacity) * 100).toFixed(1)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
