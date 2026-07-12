const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const reportController = require("../controllers/reportController");

// ==============================
// REPORT ROUTES
// ==============================

router.get(
  "/kpis",
  auth,
  reportController.kpis
);

router.get(
  "/analytics",
  auth,
  reportController.reports
);

module.exports = router;