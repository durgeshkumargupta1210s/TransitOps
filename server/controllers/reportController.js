const Trip = require('../models/trip');
const Vehicle = require('../models/vehicle');
const Expense = require('../models/expense');
const FuelLog = require('../models/fuellog');
const Driver = require('../models/driver');
const Maintenance = require('../models/maintenance');

exports.kpis = async (req, res, next) => {
  try {
    const activeVehicles = await Vehicle.countDocuments({ status: { $ne: 'Retired' } });
    const availableVehicles = await Vehicle.countDocuments({ status: 'Available' });
    const inMaintenance = await Vehicle.countDocuments({ status: 'In Shop' });
    const retired = await Vehicle.countDocuments({ status: 'Retired' });
    const tripsToday = await Trip.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)) } });
    const pendingTrips = await Trip.countDocuments({ status: { $in: ['Draft','Dispatched'] } });
    const driversOnDuty = await Driver.countDocuments({ status: 'On Trip' });

    // basic aggregations
    const fuelCost = (await FuelLog.aggregate([{ $group: { _id: null, total: { $sum: '$cost' }}}]))[0]?.total || 0;
    const maintenanceCost = (await Maintenance.aggregate([{ $group: { _id: null, total: { $sum: '$cost' }}}]))[0]?.total || 0;
    const operationalCost = fuelCost + maintenanceCost;
    const fuelEfficiency = (await Trip.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, totalDistance: { $sum: '$actualDistance' }, totalFuel: { $sum: '$fuelConsumed' } } },
      { $project: { efficiency: { $cond: [{ $eq: ['$totalFuel', 0] }, 0, { $divide: ['$totalDistance', '$totalFuel'] }] } } }
    ]))[0]?.efficiency || 0;
    const vehicleRoi = (await Trip.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: '$vehicle', revenue: { $sum: '$revenue' } } }
    ]))
      .map(item => item.revenue)
      .reduce((sum, val) => sum + val, 0);

    res.json({ activeVehicles, availableVehicles, inMaintenance, retired, tripsToday, pendingTrips, driversOnDuty, fuelCost, maintenanceCost, operationalCost, fuelEfficiency, vehicleRoi });
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

    if (type === 'trips-per-driver'){
      const data = await Trip.aggregate([
        { $group: { _id: '$driver', trips: { $sum: 1 } } }
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

    if (type === 'expense-distribution'){
      const data = await Expense.aggregate([
        { $group: { _id: '$type', total: { $sum: '$amount' } } },
        { $sort: { total: -1 } }
      ]);
      return res.json(data);
    }

    if (type === 'maintenance-trend'){
      const data = await Maintenance.aggregate([
        { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, total: { $sum: '$cost' } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);
      return res.json(data);
    }

    if (type === 'fleet-utilization'){
      const data = await Vehicle.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);
      return res.json(data);
    }

    if (type === 'revenue-vs-cost'){
      const revenue = (await Trip.aggregate([{ $match: { status: 'Completed' } }, { $group: { _id: null, total: { $sum: '$revenue' } } }]))[0]?.total || 0;
      const fuel = (await FuelLog.aggregate([{ $group: { _id: null, total: { $sum: '$cost' } } }]))[0]?.total || 0;
      const maintenance = (await Maintenance.aggregate([{ $group: { _id: null, total: { $sum: '$cost' } } }]))[0]?.total || 0;
      const expenses = (await Expense.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]))[0]?.total || 0;
      return res.json([{ name: 'Revenue', value: revenue }, { name: 'Fuel', value: fuel }, { name: 'Maintenance', value: maintenance }, { name: 'Expenses', value: expenses }]);
    }

    if (type === 'vehicle-roi'){
      const data = await Trip.aggregate([
        { $match: { status: 'Completed' } },
        { $group: { _id: '$vehicle', revenue: { $sum: '$revenue' }, trips: { $sum: 1 } } },
      ]);
      return res.json(data);
    }

    res.status(400).json({ error: 'Unknown report type' });
  } catch (err) { next(err); }
}
