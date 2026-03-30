const express = require('express');
const Expo = require('../models/Expo');
const Session = require('../models/Session');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get my registrations
router.get('/my', auth, async (req, res) => {
  try {
    const expos = await Expo.find({ registeredAttendees: req.user._id }).select('title date location status');
    const sessions = await Session.find({ registeredUsers: req.user._id })
      .populate('expo', 'title')
      .select('title startTime endTime location speaker type expo');
    res.json({ expos, sessions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
