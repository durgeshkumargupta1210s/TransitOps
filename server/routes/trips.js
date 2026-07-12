const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
const roles = require("../middleware/roles"); // Change to "../middleware/role" if your file is role.js

const tripController = require("../controllers/tripController");

// ==============================
// TRIP ROUTES
// ==============================

router.post(
  "/",
  auth,
  roles(["Dispatcher", "Fleet Manager"]),
  tripController.createTrip
);

router.get(
  "/",
  auth,
  tripController.listTrips
);

router.get(
  "/:id",
  auth,
  tripController.getTrip
);

router.post(
  "/:id/dispatch",
  auth,
  roles(["Dispatcher", "Fleet Manager"]),
  tripController.dispatchTrip
);

router.post(
  "/:id/complete",
  auth,
  roles(["Dispatcher", "Fleet Manager"]),
  tripController.completeTrip
);

router.post(
  "/:id/cancel",
  auth,
  roles(["Dispatcher", "Fleet Manager"]),
  tripController.cancelTrip
);

module.exports = router;