const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/collabbridge';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error] Could not connect to MongoDB at ${uri}`);
    console.error(`Reason: ${error.message}`);
    console.error(`\nTroubleshooting tips:`);
    console.error(`1. Check if MongoDB Community Server is running: 'brew services start mongodb-community' or run 'mongod'`);
    console.error(`2. If using MongoDB Atlas, check your network whitelist and MONGODB_URI in server/.env`);
    console.error(`3. You can inspect database collections via MongoDB Compass at ${uri}\n`);
    // Do not crash server in dev mode, let it stay alive and provide 503 on database-dependent requests
    return null;
  }
};

module.exports = connectDB;
