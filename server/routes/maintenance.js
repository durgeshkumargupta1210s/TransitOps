const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
const roles = require("../middleware/roles"); // Change to "../middleware/role" if your file is role.js

const maintenanceController = require("../controllers/maintenanceController");

// ==============================
// MAINTENANCE ROUTES
// ==============================

router.post(
  "/",
  auth,
  roles(["Fleet Manager"]),
  maintenanceController.createMaintenance
);

router.get(
  "/",
  auth,
  maintenanceController.listMaintenance
);

router.get(
  "/:id",
  auth,
  maintenanceController.getMaintenance
);

router.post(
  "/:id/close",
  auth,
  roles(["Fleet Manager"]),
  maintenanceController.closeMaintenance
);

router.delete(
  "/:id",
  auth,
  roles(["Fleet Manager"]),
  maintenanceController.deleteMaintenance
);

module.exports = router;