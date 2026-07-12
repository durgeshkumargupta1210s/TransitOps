const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    vehicleModel: {
      type: String,
      required: true,
      trim: true,
    },

    vehicleType: {
      type: String,
      required: true,
      trim: true,
    },

    maximumLoadCapacity: {
      type: Number,
      required: true,
      min: 0,
    },

    odometer: {
      type: Number,
      default: 0,
      min: 0,
    },

    acquisitionCost: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "Available",
        "On Trip",
        "In Shop",
        "Retired",
      ],
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);