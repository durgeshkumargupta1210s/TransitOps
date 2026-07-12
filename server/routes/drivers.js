const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
const roles = require("../middleware/roles"); // <-- if your file is role.js
// const roles = require("../middleware/roles"); // <-- if your file is roles.js

const driverController = require("../controllers/driverController");

router.post("/", auth, roles(["Fleet Manager"]), driverController.createDriver);

router.get("/", auth, driverController.listDrivers);

router.get("/:id", auth, driverController.getDriver);

router.put(
  "/:id",
  auth,
  roles(["Fleet Manager", "Dispatcher"]),
  driverController.updateDriver
);

router.delete(
  "/:id",
  auth,
  roles(["Fleet Manager"]),
  driverController.deleteDriver
);

module.exports = router;