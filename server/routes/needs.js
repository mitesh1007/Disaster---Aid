const express = require('express');
const router = express.Router();
const Need = require('../models/Need');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { findMatchesForNeed } = require('../utils/geoMatch');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'disasteraid/needs', allowed_formats: ['jpg', 'png', 'jpeg'] }
});
const upload = multer({ storage });

// Get all needs
router.get('/', async (req, res) => {
  try {
    const needs = await Need.find().sort({ createdAt: -1 });
    res.json(needs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get open needs only
router.get('/open', async (req, res) => {
  try {
    const needs = await Need.find({ status: 'open' }).sort({ createdAt: -1 });
    res.json(needs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get matches for a need
router.get('/:id/matches', async (req, res) => {
  try {
    const need = await Need.findById(req.params.id);
    if (!need) return res.status(404).json({ error: 'Need not found' });
    const matches = await findMatchesForNeed(need);
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Post a new need
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const data = JSON.parse(req.body.data);
    if (req.file) data.photo = req.file.path;
    const need = new Need(data);
    await need.save();
    const io = req.app.get('io');
    io.emit('newNeed', need);
    res.status(201).json(need);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update need status
router.patch('/:id/status', async (req, res) => {
  try {
    const need = await Need.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    const io = req.app.get('io');
    io.emit('updateNeed', need);
    res.json(need);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Edit a need
router.patch('/:id', async (req, res) => {
  try {
    const need = await Need.findByIdAndUpdate(req.params.id, req.body, { new: true });
    const io = req.app.get('io');
    io.emit('updateNeed', need);
    res.json(need);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a need
router.delete('/:id', async (req, res) => {
  try {
    await Need.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;