const express = require('express');
const router = express.Router();
const Session = require('../models/Session');

// Start a new session
router.post('/sessions', async (req, res) => {
  try {
    const session = new Session({
      userId: req.body.userId,
      startTime: new Date()
    });
    await session.save();
    res.status(201).json(session);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// End a session
router.patch('/sessions/:id/end', async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    session.endTime = new Date();
    session.duration = (session.endTime - session.startTime) / (1000 * 60);
    session.completed = true;
    await session.save();

    res.json(session);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Log a distraction
router.post('/sessions/:id/distractions', async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    session.distractions.push({
      type: req.body.type,
      note: req.body.note
    });
    await session.save();

    res.status(201).json(session);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get session history
router.get('/sessions/:userId', async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;