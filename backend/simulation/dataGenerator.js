const Ship = require('../models/Ship');
const triggerAnomalyAlert = require('../services/anomalyService');
const predictAnomaly = require('../utils/mlPredictor');

module.exports = function startFleetSimulation(io) {

    const updateFleetPositions = async () => {
        const ships = await Ship.find({});

        for (const ship of ships) {

            const oldLat = ship.position.lat;
            const oldLng = ship.position.lng;
            const oldCourse = ship.course || 0;
            const oldFuel = ship.fuel || 100;

            // Simulated movement
            const newLat = oldLat + (Math.random() * 0.001);
            const newLng = oldLng + (Math.random() * 0.001);
            const newCourse = (oldCourse + (Math.random() * 10 - 5)) % 360;
            const fuelLoss = Math.random() * 2;

            // Prepare ML features
            const features = {
                speed: ship.speed || 20,
                fuelDrop: fuelLoss,
                courseChange: Math.abs(newCourse - oldCourse),
                latDelta: Math.abs(newLat - oldLat),
                lngDelta: Math.abs(newLng - oldLng)
            };

            // 🔥 ML prediction
            const result = await predictAnomaly(features);

            if (result === 'ANOMALY') {
                ship.status = 'Anomaly';

                triggerAnomalyAlert(io, ship, 'ML_DETECTED_ANOMALY');
            } else {
                ship.status = 'Normal';
            }

            // Apply updates
            ship.course = newCourse;
            ship.fuel = Math.max(oldFuel - fuelLoss, 0);
            ship.position = { lat: newLat, lng: newLng };
            ship.lastUpdated = new Date();

            await ship.save();
        }

        io.emit('fleetUpdate', ships);
    };

    setInterval(updateFleetPositions, 10000);
};
