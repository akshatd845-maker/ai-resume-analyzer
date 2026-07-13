// Production Hardened Entry Point - Verifies secure environment variables and starts server
const config = require('./src/config/env');
const mongoose = require('mongoose');
const app = require('./src/app');
const connectDB = require('./src/config/database');
const dns = require('dns');

//  Set Servers
dns.setServers(['1.1.1.1', '8.8.8.8'])
// Validate required environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'AI_API_KEY',
];
const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.error(`Fatal Startup Error: Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

const PORT = config.port;
const NODE_ENV = config.nodeEnv;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
    });

    const gracefulShutdown = async (signal) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        console.log('HTTP server closed.');
        try {
          await mongoose.connection.close();
          console.log('MongoDB connection closed.');
          process.exit(0);
        } catch (error) {
          console.error(`Error closing MongoDB connection: ${error.message}`);
          process.exit(1);
        }
      });

      setTimeout(() => {
        console.error('Forced shutdown after timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();