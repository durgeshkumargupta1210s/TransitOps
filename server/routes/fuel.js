const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
const roles = require("../middleware/roles"); // Change to "../middleware/role" if your file is role.js

const fuelController = require("../controllers/fuelController");

// ==============================
// FUEL LOG ROUTES
// ==============================

router.post(
  "/",
  auth,
  roles(["Dispatcher", "Fleet Manager"]),
  fuelController.createFuelLog
);

router.get(
  "/",
  auth,
  fuelController.listFuelLogs
);

router.get(
  "/:id",
  auth,
  fuelController.getFuelLog
);

router.delete(
  "/:id",
  auth,
  roles(["Fleet Manager"]),
  fuelController.deleteFuelLog
);

module.exports = router;