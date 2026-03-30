const express = require('express');
const Exhibitor = require('../models/Exhibitor');
const { auth, adminOnly } = require('../middleware/auth');
const router = express.Router();

// Get all exhibitors for an expo
router.get('/expo/:expoId', async (req, res) => {
  try {
    const exhibitors = await Exhibitor.find({ expo: req.params.expoId, status: 'approved' })
      .populate('user', 'name email');
    res.json(exhibitors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all exhibitors (admin)
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const { status, expo } = req.query;
    let query = {};
    if (status) query.status = status;
    if (expo) query.expo = expo;
    const exhibitors = await Exhibitor.find(query)
      .populate('user', 'name email')
      .populate('expo', 'title date');
    res.json(exhibitors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Apply as exhibitor
router.post('/', auth, async (req, res) => {
  try {
    const existing = await Exhibitor.findOne({ user: req.user._id, expo: req.body.expo });
    if (existing) return res.status(400).json({ message: 'Already applied for this expo' });
    const exhibitor = new Exhibitor({ ...req.body, user: req.user._id });
    await exhibitor.save();
    res.status(201).json(exhibitor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update exhibitor application
router.put('/:id', auth, async (req, res) => {
  try {
    const exhibitor = await Exhibitor.findById(req.params.id);
    if (!exhibitor) return res.status(404).json({ message: 'Not found' });
    if (exhibitor.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const updated = await Exhibitor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve/Reject exhibitor (admin)
router.patch('/:id/status', auth, adminOnly, async (req, res) => {
  try {
    const { status, boothNumber } = req.body;
    const exhibitor = await Exhibitor.findByIdAndUpdate(
      req.params.id,
      { status, boothNumber },
      { new: true }
    ).populate('user', 'name email');
    res.json(exhibitor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my exhibitor applications
router.get('/my', auth, async (req, res) => {
  try {
    const exhibitors = await Exhibitor.find({ user: req.user._id })
      .populate('expo', 'title date location status');
    res.json(exhibitors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
