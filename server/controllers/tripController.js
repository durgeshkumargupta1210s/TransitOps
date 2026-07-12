const Trip = require('../models/trip');
const Vehicle = require('../models/vehicle');
const Driver = require('../models/driver');

// Create trip (Draft)
exports.createTrip = async (req, res, next) => {
  try {
    const body = req.body;
    // Validate cargo weight vs vehicle capacity
    const vehicle = await Vehicle.findById(body.vehicle);
    if (!vehicle) return res.status(400).json({ error: 'Vehicle not found' });
    if (vehicle.status === 'Retired') return res.status(400).json({ error: 'Retired vehicles cannot be assigned' });
    if (vehicle.status === 'In Shop') return res.status(400).json({ error: 'Vehicles in maintenance cannot be assigned' });
    if (body.cargoWeight > vehicle.maximumLoadCapacity) return res.status(400).json({ error: 'Cargo exceeds vehicle capacity' });

    const driver = await Driver.findById(body.driver);
    if (!driver) return res.status(400).json({ error: 'Driver not found' });
    if (driver.status === 'Suspended') return res.status(400).json({ error: 'Suspended drivers cannot be assigned' });
    if (new Date(driver.licenseExpiryDate) < new Date()) return res.status(400).json({ error: 'Driver license expired' });

    const trip = await Trip.create(body);
    res.json(trip);
  } catch (err) { next(err); }
}

exports.listTrips = async (req, res, next) => {
  try {
    const { page=1, limit=20, status, search } = req.query;
    const q = {};
    if (status) q.status = status;
    if (search) q.$or = [ { source: new RegExp(search,'i') }, { destination: new RegExp(search,'i') } ];
    const items = await Trip.find(q).populate('vehicle driver').skip((page-1)*limit).limit(parseInt(limit));
    const total = await Trip.countDocuments(q);
    res.json({ items, total });
  } catch (err) { next(err); }
}

exports.getTrip = async (req, res, next) => { try { const t = await Trip.findById(req.params.id).populate('vehicle driver'); if (!t) return res.status(404).json({error:'Not found'}); res.json(t); } catch (err) { next(err); } }

// Dispatch trip: set trip status to Dispatched and update vehicle/driver
exports.dispatchTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    if (trip.status !== 'Draft') return res.status(400).json({ error: 'Only Draft trips can be dispatched' });

    const vehicle = await Vehicle.findById(trip.vehicle);
    const driver = await Driver.findById(trip.driver);

    if (!vehicle || !driver) return res.status(400).json({ error: 'Vehicle or driver invalid' });
    if (vehicle.status !== 'Available') return res.status(400).json({ error: 'Vehicle not available' });
    if (driver.status !== 'Available') return res.status(400).json({ error: 'Driver not available' });
    if (new Date(driver.licenseExpiryDate) < new Date()) return res.status(400).json({ error: 'Driver license expired' });
    if (trip.cargoWeight > vehicle.maximumLoadCapacity) return res.status(400).json({ error: 'Cargo exceeds vehicle capacity' });

    trip.status = 'Dispatched';
    await trip.save();
    vehicle.status = 'On Trip';
    await vehicle.save();
    driver.status = 'On Trip';
    await driver.save();

    res.json({ trip, vehicle, driver });
  } catch (err) { next(err); }
}

// Complete trip: set status to Completed and update vehicle/driver
exports.completeTrip = async (req, res, next) => {
  try {
    const { actualDistance, fuelConsumed, finalOdometer, revenue } = req.body;
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    if (trip.status !== 'Dispatched') return res.status(400).json({ error: 'Only Dispatched trips can be completed' });

    trip.actualDistance = actualDistance || trip.actualDistance;
    trip.fuelConsumed = fuelConsumed || trip.fuelConsumed;
    trip.finalOdometer = finalOdometer || trip.finalOdometer;
    trip.revenue = revenue || trip.revenue;
    trip.status = 'Completed';
    await trip.save();

    const vehicle = await Vehicle.findById(trip.vehicle);
    const driver = await Driver.findById(trip.driver);
    if (vehicle && vehicle.status !== 'Retired') vehicle.status = 'Available';
    if (vehicle) await vehicle.save();
    if (driver) { driver.status = 'Available'; await driver.save(); }

    res.json({ trip, vehicle, driver });
  } catch (err) { next(err); }
}

// Cancel trip: set status to Cancelled and update vehicle/driver
exports.cancelTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    if (trip.status === 'Completed' || trip.status === 'Cancelled') return res.status(400).json({ error: 'Cannot cancel' });

    trip.status = 'Cancelled';
    await trip.save();

    const vehicle = await Vehicle.findById(trip.vehicle);
    const driver = await Driver.findById(trip.driver);
    if (vehicle && vehicle.status !== 'Retired') vehicle.status = 'Available';
    if (vehicle) await vehicle.save();
    if (driver) { driver.status = 'Available'; await driver.save(); }

    res.json({ trip, vehicle, driver });
  } catch (err) { next(err); }
}
