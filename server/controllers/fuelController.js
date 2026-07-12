const FuelLog = require("../models/fuellog");
const Vehicle = require("../models/vehicle");

// ==============================
// CREATE FUEL LOG
// ==============================
exports.createFuelLog = async (req, res, next) => {
  try {
    const body = req.body;

    const vehicle = await Vehicle.findById(body.vehicle);

    if (!vehicle)
      return res.status(404).json({
        error: "Vehicle not found",
      });

    const fuelLog = await FuelLog.create(body);

    const result = await FuelLog.findById(fuelLog._id)
      .populate("vehicle");

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

// ==============================
// LIST FUEL LOGS
// ==============================
exports.listFuelLogs = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
    } = req.query;

    const query = {};

    if (search) {
      const numeric = Number(search);

      query.$or = [
        {
          vehicle: search,
        },
        ...(Number.isFinite(numeric)
          ? [
              { liters: numeric },
              { cost: numeric },
            ]
          : []),
      ];
    }

    const items = await FuelLog.find(query)
      .populate("vehicle")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await FuelLog.countDocuments(query);

    res.json({
      items,
      total,
    });
  } catch (err) {
    next(err);
  }
};

// ==============================
// GET FUEL LOG
// ==============================
exports.getFuelLog = async (req, res, next) => {
  try {
    const fuelLog = await FuelLog.findById(req.params.id)
      .populate("vehicle");

    if (!fuelLog)
      return res.status(404).json({
        error: "Fuel log not found",
      });

    res.json(fuelLog);
  } catch (err) {
    next(err);
  }
};

// ==============================
// DELETE FUEL LOG
// ==============================
exports.deleteFuelLog = async (req, res, next) => {
  try {
    const fuelLog = await FuelLog.findById(req.params.id);

    if (!fuelLog)
      return res.status(404).json({
        error: "Fuel log not found",
      });

    await fuelLog.deleteOne();

    res.json({
      message: "Fuel log deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};