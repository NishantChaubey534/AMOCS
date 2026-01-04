const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const Ship = require('./models/Ship');
const startFleetSimulation = require('./simulation/dataGenerator');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

// ======================
// MongoDB Connection (Atlas)
// ======================
mongoose.connect(
    'mongodb+srv://2229132_db_user:zTtOWHWd0Z1wcQyi@cluster1.xoffiq8.mongodb.net/amocs?retryWrites=true&w=majority&appName=Cluster1',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
.then(() => console.log('✅ MongoDB Atlas connected'))
.catch(err => console.error('❌ MongoDB error:', err));

// ======================
// Socket.IO Connections
// ======================
io.on('connection', async (socket) => {
    console.log('🚢 New client connected to Command Center');

    // Send initial fleet data
    const ships = await Ship.find({});
    socket.emit('fleetUpdate', ships);

    // Manual override
    socket.on('overrideCommand', async ({ shipId, newCourse }) => {
        const ship = await Ship.findOne({ shipId });
        if (!ship) return;

        ship.course = newCourse;
        ship.status = 'Normal';
        ship.lastUpdated = new Date();
        await ship.save();

        io.emit('fleetUpdate', await Ship.find({}));
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// ======================
// API: Manual Anomaly Trigger
// ======================
app.post('/api/simulate-anomaly', async (req, res) => {
    const { shipId, anomalyType } = req.body;

    const ship = await Ship.findOne({ shipId });
    if (!ship) {
        return res.status(404).json({ message: 'Ship not found' });
    }

    ship.status = 'Anomaly';
    ship.lastUpdated = new Date();
    await ship.save();

    const anomalyEvent = {
        shipId: ship.shipId,
        name: ship.name,
        type: anomalyType || 'MANUAL_TRIGGER',
        position: ship.position,
        fuel: ship.fuel,
        course: ship.course,
        timestamp: new Date()
    };

    io.emit('anomalyAlert', anomalyEvent);

    res.json({ message: 'Anomaly simulated successfully' });
});

// ======================
// Start Fleet Simulation
// ======================
startFleetSimulation(io);

// ======================
// Start Server
// ======================
const PORT = 3001;
server.listen(PORT, () => {
    console.log(`🚀 AMOCS backend running on port ${PORT}`);
});
