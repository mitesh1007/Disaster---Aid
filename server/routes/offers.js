const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'disasteraid/offers', allowed_formats: ['jpg', 'png', 'jpeg'] }
});
const upload = multer({ storage });

// Get all offers
router.get('/', async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Post a new offer
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const data = JSON.parse(req.body.data);
    if (req.file) data.photo = req.file.path;
    const offer = new Offer(data);
    await offer.save();
    const io = req.app.get('io');
    io.emit('newOffer', offer);
    res.status(201).json(offer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update offer status
router.patch('/:id/status', async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    const io = req.app.get('io');
    io.emit('updateOffer', offer);
    res.json(offer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an offer
router.delete('/:id', async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.patch('/:id', async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    const io = req.app.get('io');
    io.emit('updateOffer', offer);
    res.json(offer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
module.exports = router;