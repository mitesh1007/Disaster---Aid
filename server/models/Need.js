const mongoose = require('mongoose');

const needSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['food', 'water', 'shelter', 'medical', 'rescue'],
    required: true
  },
  description: { type: String, required: true },
  quantity: { type: String },
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
  status: {
    type: String,
    enum: ['open', 'inprogress', 'resolved'],
    default: 'open'
  }
}, { timestamps: true });

module.exports = mongoose.model('Need', needSchema);