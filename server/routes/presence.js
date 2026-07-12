const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const presence = require('../utils/presence');

router.get('/', auth, async (req, res, next) => {
  try {
    const online = presence.getOnline();
    res.json({ online });
  } catch (err) { next(err); }
});

module.exports = router;
