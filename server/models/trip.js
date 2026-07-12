const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },

    source: {
      type: String,
      required: true,
      trim: true,
    },

    destination: {
      type: String,
      required: true,
      trim: true,
    },

    cargoWeight: {
      type: Number,
      required: true,
      min: 0,
    },

    plannedDistance: {
      type: Number,
      required: true,
      min: 0,
    },

    actualDistance: {
      type: Number,
      default: 0,
      min: 0,
    },

    fuelConsumed: {
      type: Number,
      default: 0,
      min: 0,
    },

    finalOdometer: {
      type: Number,
      default: 0,
      min: 0,
    },

    revenue: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "Draft",
        "Dispatched",
        "Completed",
        "Cancelled",
      ],
      default: "Draft",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Trip", tripSchema);