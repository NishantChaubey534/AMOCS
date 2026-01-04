const mongoose = require('mongoose');
const Ship = require('./models/Ship');

mongoose.connect(
  'mongodb+srv://2229132_db_user:zTtOWHWd0Z1wcQyi@cluster1.xoffiq8.mongodb.net/amocs?retryWrites=true&w=majority&appName=Cluster1',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const ships = [
  {
    shipId: 'SHIP001',
    name: 'INS Visakhapatnam',
    type: 'Destroyer',
    position: { lat: 17.6868, lng: 83.2185 },
    course: 90,
    speed: 20,
    fuel: 100,
    status: 'Normal'
  },
  {
    shipId: 'SHIP002',
    name: 'INS Chennai',
    type: 'Frigate',
    position: { lat: 13.0827, lng: 80.2707 },
    course: 45,
    speed: 18,
    fuel: 100,
    status: 'Normal'
  },
  {
    shipId: 'SHIP003',
    name: 'INS Kolkata',
    type: 'Destroyer',
    position: { lat: 22.5726, lng: 88.3639 },
    course: 180,
    speed: 22,
    fuel: 100,
    status: 'Normal'
  }
];

async function seed() {
  try {
    await Ship.deleteMany({});
    await Ship.insertMany(ships);
    console.log('✅ Ships seeded successfully');
  } catch (err) {
    console.error('❌ Seeding error:', err);
  } finally {
    mongoose.connection.close();
  }
}

seed();
