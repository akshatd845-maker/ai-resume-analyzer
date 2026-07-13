/**
 * Seed an administrator user for local development.
 *
 * Usage: node scripts/seed-admin.js
 */
require('../src/config/env'); // Loads dotenv config correctly
const mongoose = require('mongoose');
const connectDB = require('../src/config/database');
const User = require('../src/models/user.model');

// Prevent running in production
if (process.env.NODE_ENV === 'production') {
  console.error("Security Error: Administrator seeding is disabled in production environments.");
  process.exit(1);
}

async function run() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("Error: ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required.");
    process.exit(1);
  }

  await connectDB();
  console.log("Connected to MongoDB database.");

  let admin = await User.findOne({ email });

  if (admin) {
    console.log(`User ${email} already exists. Updating role to admin...`);
    admin.role = 'admin';
    await admin.save();
    console.log("Admin user updated successfully.");
  } else {
    console.log(`Creating new admin user with email ${email}...`);
    admin = await User.create({
      name: 'System Administrator',
      email,
      password,
      role: 'admin'
    });
    console.log("Admin user created successfully.");
  }

  await mongoose.connection.close();
  process.exit(0);
}

run().catch(err => {
  console.error("Failed to run seed script:", err.message);
  if (mongoose.connection.readyState !== 0) {
    mongoose.connection.close();
  }
  process.exit(1);
});
