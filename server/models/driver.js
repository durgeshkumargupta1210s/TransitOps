const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    licenseCategory: {
      type: String,
      required: true,
      trim: true,
    },

    licenseExpiryDate: {
      type: Date,
      required: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    contactNumber: {
      type: String,
      trim: true,
    },

    safetyScore: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },

    status: {
      type: String,
      enum: [
        "Available",
        "On Trip",
        "Off Duty",
        "Suspended",
      ],
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Driver", driverSchema);