const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const dc = require('../controllers/driverController');

router.post('/', auth, roles(['Fleet Manager']), dc.createDriver);
router.get('/', auth, dc.listDrivers);
router.get('/:id', auth, dc.getDriver);
router.put('/:id', auth, roles(['Fleet Manager','Dispatcher']), dc.updateDriver);
router.delete('/:id', auth, roles(['Fleet Manager']), dc.deleteDriver);

module.exports = router;
