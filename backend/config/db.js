const mongoose = require('mongoose');

async function connectDB() {
  try {
    const connection = await mongoose.connect(
      process.env.MONGODB_URI,
      {
        serverSelectionTimeoutMS: 10000
      }
    );

    console.log(
      `MongoDB connected successfully: ${connection.connection.name}`
    );
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
}

module.exports = connectDB;
