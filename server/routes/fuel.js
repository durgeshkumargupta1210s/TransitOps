const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const fc = require('../controllers/fuelController');

router.post('/', auth, roles(['Dispatcher','Fleet Manager']), fc.createFuelLog);
router.get('/', auth, fc.listFuelLogs);
router.get('/:id', auth, fc.getFuelLog);
router.delete('/:id', auth, roles(['Fleet Manager']), fc.deleteFuelLog);

module.exports = router;
