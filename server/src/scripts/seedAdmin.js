/**
 * Script to create an admin user
 * Run: npm run seed:admin
 */

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const ADMIN_USER = {
  username: "admin",
  email: "admin@taskmanager.com",
  password: "admin123",
  role: "admin",
};

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_USER.email });

    if (existingAdmin) {
      console.log("Admin user already exists:");
      console.log(`  Email: ${ADMIN_USER.email}`);
      console.log(`  Role: ${existingAdmin.role}`);
    } else {
      // Create admin user
      const admin = await User.create(ADMIN_USER);
      console.log("Admin user created successfully:");
      console.log(`  Username: ${admin.username}`);
      console.log(`  Email: ${admin.email}`);
      console.log(`  Role: ${admin.role}`);
      console.log(`  Password: ${ADMIN_USER.password}`);
    }

    // Disconnect
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
