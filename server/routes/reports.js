const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const rc = require('../controllers/reportController');

router.get('/kpis', auth, rc.kpis);
router.get('/analytics', auth, rc.reports);

module.exports = router;
