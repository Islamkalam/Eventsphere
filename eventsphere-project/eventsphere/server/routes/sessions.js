const express = require('express');
const Session = require('../models/Session');
const { auth, adminOnly } = require('../middleware/auth');
const router = express.Router();

// Get sessions for an expo
router.get('/expo/:expoId', async (req, res) => {
  try {
    const sessions = await Session.find({ expo: req.params.expoId }).sort({ startTime: 1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create session (admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const session = new Session(req.body);
    await session.save();
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update session (admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete session (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.params.id);
    res.json({ message: 'Session deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Bookmark a session
router.post('/:id/bookmark', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.registeredUsers.includes(req.user._id)) {
      session.registeredUsers = session.registeredUsers.filter(u => u.toString() !== req.user._id.toString());
    } else {
      session.registeredUsers.push(req.user._id);
    }
    await session.save();
    res.json({ bookmarked: session.registeredUsers.includes(req.user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
