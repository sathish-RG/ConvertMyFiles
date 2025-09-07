const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } else {
      console.log('MongoDB URI not provided. Running without database.');
    }
  } catch (error) {
    console.error('Database connection error:', error);
    // Don't exit process, continue without database
  }
};

module.exports = connectDB;