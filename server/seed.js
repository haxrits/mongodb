const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('./db');
const { seedDatabase } = require('./controllers/seedController');
const mongoose = require('mongoose');

async function runSeed() {
  try {
    console.log('[Seed] Connecting to MongoDB Atlas...');
    await connectDB();

    console.log('[Seed] Seeding demo dataset...');
    const result = await seedDatabase();

    console.log('[Seed] Success:', result);
    await mongoose.connection.close();
    console.log('[Seed] Database connection closed.');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]', err);
    process.exit(1);
  }
}

runSeed();
