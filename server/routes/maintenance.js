const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const mc = require('../controllers/maintenanceController');

router.post('/', auth, roles(['Fleet Manager']), mc.createMaintenance);
router.get('/', auth, mc.listMaintenance);
router.get('/:id', auth, mc.getMaintenance);
router.post('/:id/close', auth, roles(['Fleet Manager']), mc.closeMaintenance);
router.delete('/:id', auth, roles(['Fleet Manager']), mc.deleteMaintenance);

module.exports = router;
