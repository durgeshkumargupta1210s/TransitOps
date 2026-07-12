const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const tc = require('../controllers/tripController');

router.post('/', auth, roles(['Dispatcher','Fleet Manager']), tc.createTrip);
router.get('/', auth, tc.listTrips);
router.get('/:id', auth, tc.getTrip);
router.post('/:id/dispatch', auth, roles(['Dispatcher','Fleet Manager']), tc.dispatchTrip);
router.post('/:id/complete', auth, roles(['Dispatcher','Fleet Manager']), tc.completeTrip);
router.post('/:id/cancel', auth, roles(['Dispatcher','Fleet Manager']), tc.cancelTrip);

module.exports = router;
