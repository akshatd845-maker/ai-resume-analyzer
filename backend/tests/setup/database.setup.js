const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

// Set test env before app modules load (setupFilesAfterEnv runs before test files)
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-for-integration-tests';
process.env.RATE_LIMIT_MAX_REQUESTS = '1000';

let mongoServer;

// Start memory server and connect mongoose
beforeAll(async () => {
  process.env.MONGOMS_DEBUG = 'false';

  mongoServer = await MongoMemoryServer.create({
    binary: {
      version: '4.4.29',
    },
  });
  const uri = mongoServer.getUri();

  // If already connected, disconnect first
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  await mongoose.connect(uri);
});

// Clear database collections between tests to ensure test isolation
afterEach(async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
});

// Close database connection and stop memory server
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});
