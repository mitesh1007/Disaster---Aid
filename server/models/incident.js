const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['flood', 'earthquake', 'cyclone', 'fire', 'drought', 'other'],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  description: { type: String },
  affectedArea: {
    center: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    radiusKm: { type: Number, default: 10 }
  },
  status: {
    type: String,
    enum: ['active', 'resolved'],
    default: 'active'
  },
  activeFrom: { type: Date, default: Date.now },
  activeTo: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Incident', incidentSchema);