const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const presence = require("../utils/presence");

// ==============================
// ONLINE USERS
// ==============================

router.get("/", auth, async (req, res, next) => {
  try {
    res.json({
      success: true,
      count: presence.getOnline().length,
      online: presence.getOnline(),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;