const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');

// Get all incidents
router.get('/', async (req, res) => {
  try {
    const incidents = await Incident.find().sort({ createdAt: -1 });
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get active incidents only
router.get('/active', async (req, res) => {
  try {
    const incidents = await Incident.find({ status: 'active' });
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Post a new incident
router.post('/', async (req, res) => {
  try {
    const incident = new Incident(req.body);
    await incident.save();
    const io = req.app.get('io');
    io.emit('newIncident', incident);
    res.status(201).json(incident);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update incident status
router.patch('/:id/status', async (req, res) => {
  try {
    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(incident);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an incident
router.delete('/:id', async (req, res) => {
  try {
    await Incident.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;