const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const exporter = require("../utils/exporter");

const Trip = require("../models/trip");

// ==============================
// EXPORT TRIPS CSV
// ==============================
router.get("/trips/csv", auth, async (req, res, next) => {
  try {
    const trips = await Trip.find()
      .populate("vehicle")
      .populate("driver")
      .lean();

    const rows = trips.map((trip) => ({
      id: trip._id,
      vehicle: trip.vehicle?.registrationNumber || "-",
      driver: trip.driver?.name || "-",
      source: trip.source,
      destination: trip.destination,
      status: trip.status,
      revenue: trip.revenue,
    }));

    const headers = [
      { id: "id", title: "ID" },
      { id: "vehicle", title: "Vehicle" },
      { id: "driver", title: "Driver" },
      { id: "source", title: "Source" },
      { id: "destination", title: "Destination" },
      { id: "status", title: "Status" },
      { id: "revenue", title: "Revenue" },
    ];

    const csv = exporter.csvFromArray(rows, headers);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=trips-report.csv"
    );

    res.send(csv);
  } catch (err) {
    next(err);
  }
});

// ==============================
// EXPORT TRIPS PDF
// ==============================
router.get("/trips/pdf", auth, async (req, res, next) => {
  try {
    const trips = await Trip.find()
      .populate("vehicle")
      .populate("driver")
      .lean();

    const rows = trips.map((trip) => ({
      id: trip._id,
      vehicle: trip.vehicle?.registrationNumber || "-",
      driver: trip.driver?.name || "-",
      source: trip.source,
      destination: trip.destination,
      status: trip.status,
      revenue: trip.revenue,
    }));

    const pdf = await exporter.pdfBufferFromText(
      "TransitOps Trips Report",
      rows
    );

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=trips-report.pdf"
    );

    res.send(pdf);
  } catch (err) {
    next(err);
  }
});

module.exports = router;