const Trip = require('../models/trip');
const Vehicle = require('../models/vehicle');
const Expense = require('../models/expense');
const FuelLog = require('../models/fuellog');

exports.kpis = async (req, res, next) => {
  try {
    const activeVehicles = await Vehicle.countDocuments({ status: { $ne: 'Retired' } });
    const availableVehicles = await Vehicle.countDocuments({ status: 'Available' });
    const inMaintenance = await Vehicle.countDocuments({ status: 'In Shop' });
    const retired = await Vehicle.countDocuments({ status: 'Retired' });
    const tripsToday = await Trip.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)) } });
    const pendingTrips = await Trip.countDocuments({ status: { $in: ['Draft','Dispatched'] } });
    const driversOnDuty = await require('../models/driver').countDocuments({ status: 'On Trip' });

    // basic aggregations
    const fuelCost = (await FuelLog.aggregate([{ $group: { _id: null, total: { $sum: '$cost' }}}]))[0]?.total || 0;
    const maintenanceCost = (await require('../models/maintenance').aggregate([{ $group: { _id: null, total: { $sum: '$cost' }}}]))[0]?.total || 0;
    const operationalCost = fuelCost + maintenanceCost;

    res.json({ activeVehicles, availableVehicles, inMaintenance, retired, tripsToday, pendingTrips, driversOnDuty, fuelCost, maintenanceCost, operationalCost });
  } catch (err) { next(err); }
}

exports.reports = async (req, res, next) => {
  try {
    const { type } = req.query;
    if (type === 'fuel-efficiency'){
      const data = await Trip.aggregate([
        { $match: { status: 'Completed' } },
        { $group: { _id: '$vehicle', totalDistance: { $sum: '$actualDistance' }, totalFuel: { $sum: '$fuelConsumed' } } },
        { $project: { vehicle: '$_id', efficiency: { $cond: [{ $eq: ['$totalFuel',0] }, 0, { $divide: ['$totalDistance','$totalFuel'] }] } } }
      ]);
      return res.json(data);
    }

    if (type === 'trips-per-vehicle'){
      const data = await Trip.aggregate([
        { $group: { _id: '$vehicle', trips: { $sum: 1 } } }
      ]);
      return res.json(data);
    }

    if (type === 'monthly-expenses'){
      const data = await Expense.aggregate([
        { $group: { _id: { month: { $month: '$date' }, year: { $year: '$date' } }, total: { $sum: '$amount' } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);
      return res.json(data);
    }

    res.status(400).json({ error: 'Unknown report type' });
  } catch (err) { next(err); }
}
