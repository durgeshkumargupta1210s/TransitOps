const express = require("express");

const router = express.Router();

const { body } = require("express-validator");

const auth = require("../middleware/auth");
const roles = require("../middleware/roles"); // Change to "../middleware/role" if your file is role.js

const userController = require("../controllers/userController");

// ==============================
// USER ROUTES
// ==============================

router.get(
  "/",
  auth,
  roles(["Fleet Manager"]),
  userController.listUsers
);

router.get(
  "/:id",
  auth,
  roles(["Fleet Manager"]),
  userController.getUser
);

router.put(
  "/:id",
  auth,
  roles(["Fleet Manager"]),
  body("email").optional().isEmail(),
  userController.updateUser
);

router.delete(
  "/:id",
  auth,
  roles(["Fleet Manager"]),
  userController.deleteUser
);

module.exports = router;