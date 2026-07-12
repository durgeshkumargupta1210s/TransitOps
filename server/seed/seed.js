require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const Vehicle = require("../models/vehicle");
const Driver = require("../models/driver");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await Driver.deleteMany({});

    // =============================
    // USERS
    // =============================
    await User.insertMany([
      {
        name: "Fleet Manager",
        email: "admin@transitops.com",
        password: await bcrypt.hash("password", 10),
        role: "Fleet Manager",
      },
      {
        name: "Dispatcher",
        email: "dispatch@transitops.com",
        password: await bcrypt.hash("password", 10),
        role: "Dispatcher",
      },
      {
        name: "Safety Officer",
        email: "safety@transitops.com",
        password: await bcrypt.hash("password", 10),
        role: "Safety Officer",
      },
    ]);

    // =============================
    // VEHICLES
    // =============================
    await Vehicle.insertMany([
      {
        registrationNumber: "ABC-1001",
        vehicleModel: "Volvo X1",
        vehicleType: "Truck",
        maximumLoadCapacity: 10000,
        odometer: 10000,
        acquisitionCost: 50000,
      },
      {
        registrationNumber: "ABC-1002",
        vehicleModel: "Isuzu M2",
        vehicleType: "Van",
        maximumLoadCapacity: 2000,
        odometer: 25000,
        acquisitionCost: 30000,
      },
    ]);

    // =============================
    // DRIVERS
    // =============================
    await Driver.insertMany([
      {
        name: "John Doe",
        licenseNumber: "L-1001",
        licenseCategory: "C",
        licenseExpiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        email: "john.doe@transitops.com",
        contactNumber: "555-0100",
      },
      {
        name: "Jane Roe",
        licenseNumber: "L-1002",
        licenseCategory: "B",
        licenseExpiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        email: "jane.roe@transitops.com",
        contactNumber: "555-0101",
      },
    ]);

    console.log("✅ Seed data inserted");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error occurred while seeding:", error);
    process.exit(1);
  }
}

seed();