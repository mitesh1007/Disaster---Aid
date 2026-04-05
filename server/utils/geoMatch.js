const Need = require('../models/Need');
const Offer = require('../models/Offer');

// Haversine formula — calculates distance between two coordinates in km
const getDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Find matching offers for a need within 10km radius
const findMatchesForNeed = async (need) => {
  const offers = await Offer.find({
    type: need.type,
    status: 'available'
  });

  const matches = offers
    .map(offer => ({
      offer,
      distance: getDistance(
        need.location.lat, need.location.lng,
        offer.location.lat, offer.location.lng
      )
    }))
    .filter(m => m.distance <= 10)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3);

  return matches;
};

// Find matching needs for an offer within 10km radius
const findMatchesForOffer = async (offer) => {
  const needs = await Need.find({
    type: offer.type,
    status: 'open'
  });

  const matches = needs
    .map(need => ({
      need,
      distance: getDistance(
        offer.location.lat, offer.location.lng,
        need.location.lat, need.location.lng
      )
    }))
    .filter(m => m.distance <= 10)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3);

  return matches;
};

module.exports = { findMatchesForNeed, findMatchesForOffer, getDistance };