const axios = require('axios');

module.exports = async function triggerAnomalyAlert(io, ship, anomalyType) {

    const anomalyEvent = {
        shipId: ship.shipId,
        name: ship.name,
        type: anomalyType,
        position: ship.position,
        fuel: ship.fuel,
        course: ship.course,
        timestamp: new Date()
    };

    // 1️⃣ Send alert to frontend
    io.emit('anomalyAlert', anomalyEvent);

    // 2️⃣ Trigger n8n workflow
    if (process.env.N8N_WEBHOOK_URL) {
        try {
            await axios.post(process.env.N8N_WEBHOOK_URL, anomalyEvent);
        } catch (err) {
            console.error('Failed to trigger n8n');
        }
    }
};
