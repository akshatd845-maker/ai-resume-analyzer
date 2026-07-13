const mongoose = require('mongoose');

let mongoServer = null;

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('Connecting to primary MongoDB Atlas...');
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds to fallback
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Connected (Atlas): ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`Primary MongoDB Atlas connection failed: ${error.message}`);
    console.log('Attempting local database connection fallback (127.0.0.1:27017)...');

    try {
      const localURI = 'mongodb://127.0.0.1:27017/ai-resume-analyzer';
      const conn = await mongoose.connect(localURI, {
        serverSelectionTimeoutMS: 2000,
      });
      console.log(`MongoDB Connected (Local): ${conn.connection.host}`);
      return conn;
    } catch (localErr) {
      console.warn(`Local MongoDB connection failed: ${localErr.message}`);
      if (process.env.NODE_ENV === 'production') {
        console.error('CRITICAL DATABASE ERROR: Primary (Atlas) and secondary (Local) MongoDB database connections failed.');
        console.error('CRITICAL DATABASE ERROR: In-memory MongoDB Server is disabled in production environments.');
        process.exit(1);
      }

      console.warn('Local MongoDB connection failed. Attempting to start in-memory MongoDB Server...');

      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongoServer = await MongoMemoryServer.create({
          instance: {
            dbName: 'ai-resume-analyzer',
          },
          binary: {
            version: '4.4.29', // Optimized version (much smaller download size than 8.x)
          },
        });
        const memoryURI = mongoServer.getUri();
        const conn = await mongoose.connect(memoryURI);
        console.log(`MongoDB Connected (In-Memory Fallback): ${conn.connection.host}`);
        console.log(`Memory Database URI: ${memoryURI}`);
        return conn;
      } catch (memError) {
        console.error(`In-Memory MongoDB fallback failed: ${memError.message}`);
        console.error('Please ensure either your Atlas Cluster IP is whitelisted or a local MongoDB service is running on port 27017.');
        process.exit(1);
      }
    }
  }
};

module.exports = connectDB;