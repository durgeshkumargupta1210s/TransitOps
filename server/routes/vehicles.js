const express = require("express");

const router = express.Router();

const { body } = require("express-validator");

const auth = require("../middleware/auth");
const roles = require("../middleware/roles"); // Change to "../middleware/role" if your file is role.js

const vehicleController = require("../controllers/vehicleController");

// ==============================
// VEHICLE ROUTES
// ==============================

router.post(
  "/",
  auth,
  roles(["Fleet Manager", "Dispatcher"]),
  body("registrationNumber").notEmpty(),
  vehicleController.createVehicle
);

router.get(
  "/",
  auth,
  vehicleController.listVehicles
);

router.get(
  "/:id",
  auth,
  vehicleController.getVehicle
);

router.put(
  "/:id",
  auth,
  roles(["Fleet Manager"]),
  vehicleController.updateVehicle
);

router.delete(
  "/:id",
  auth,
  roles(["Fleet Manager"]),
  vehicleController.deleteVehicle
);

module.exports = router;