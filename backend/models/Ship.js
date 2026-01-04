const mongoose = require('mongoose');

const ShipSchema = new mongoose.Schema({
    shipId: { type: String, required: true, unique: true },
    name: { type: String, default: 'INS Unknown' },
    type: { type: String, enum: ['Patrol Vessel', 'Destroyer', 'Frigate'], required: true },
    position: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    course: { type: Number }, // in degrees
    speed: { type: Number }, // in knots
    fuel: { type: Number, min: 0, max: 100 }, // percentage
    status: { type: String, enum: ['Normal', 'Anomaly', 'Maintenance'], default: 'Normal' },
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ship', ShipSchema);