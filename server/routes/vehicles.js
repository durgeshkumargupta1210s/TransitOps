const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const { body } = require('express-validator');
const vc = require('../controllers/vehicleController');

router.post('/', auth, roles(['Fleet Manager','Dispatcher']),
  body('registrationNumber').notEmpty(),
  vc.createVehicle);

router.get('/', auth, vc.listVehicles);
router.get('/:id', auth, vc.getVehicle);
router.put('/:id', auth, roles(['Fleet Manager']), vc.updateVehicle);
router.delete('/:id', auth, roles(['Fleet Manager']), vc.deleteVehicle);

module.exports = router;
