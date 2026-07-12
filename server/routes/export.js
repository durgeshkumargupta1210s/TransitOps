const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const exporter = require('../utils/exporter');
const Trip = require('../models/trip');

router.get('/trips/csv', auth, async (req, res, next) => {
  try {
    const trips = await Trip.find().populate('vehicle driver').lean();
    const rows = trips.map(t => ({ id: t._id, vehicle: t.vehicle.registrationNumber, driver: t.driver.name, status: t.status, revenue: t.revenue }));
    const headers = [ {id:'id', title:'ID'}, {id:'vehicle', title:'Vehicle'}, {id:'driver', title:'Driver'}, {id:'status', title:'Status'}, {id:'revenue', title:'Revenue'} ];
    const csv = exporter.csvFromArray(rows, headers);
    res.setHeader('Content-Type', 'text/csv');
    res.send(csv);
  } catch (err) { next(err); }
});

router.get('/trips/pdf', auth, async (req, res, next) => {
  try {
    const trips = await Trip.find().populate('vehicle driver').lean();
    const rows = trips.map(t => ({ id: t._id, vehicle: t.vehicle.registrationNumber, driver: t.driver.name, status: t.status, revenue: t.revenue }));
    const buf = await exporter.pdfBufferFromText('Trips Report', rows);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(buf);
  } catch (err) { next(err); }
});

module.exports = router;
