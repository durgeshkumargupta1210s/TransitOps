const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
const roles = require("../middleware/roles"); // Change to "../middleware/role" if your file is role.js

const expenseController = require("../controllers/expenseController");

// ==============================
// EXPENSE ROUTES
// ==============================

router.post(
  "/",
  auth,
  roles(["Financial Analyst", "Fleet Manager"]),
  expenseController.createExpense
);

router.get(
  "/",
  auth,
  expenseController.listExpenses
);

router.get(
  "/:id",
  auth,
  expenseController.getExpense
);

router.delete(
  "/:id",
  auth,
  roles(["Financial Analyst", "Fleet Manager"]),
  expenseController.deleteExpense
);

module.exports = router;