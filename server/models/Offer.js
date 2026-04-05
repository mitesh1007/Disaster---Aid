const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['food', 'water', 'shelter', 'medical', 'rescue'],
    required: true
  },
  description: { type: String, required: true },
  capacity: { type: String },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  photo: { type: String },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String }
  },
  postedBy: { type: String, required: true },
  contact: { type: String, required: true },
  availableUntil: { type: Date },
  status: {
    type: String,
    enum: ['available', 'matched', 'closed'],
    default: 'available'
  }
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);