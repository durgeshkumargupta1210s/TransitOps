const Vehicle = require("../models/vehicle");
const Maintenance = require("../models/maintenance");
const Trip = require("../models/trip");

// ==============================
// CREATE VEHICLE
// ==============================
exports.createVehicle = async (req, res, next) => {
  try {
    const body = req.body;

    const exists = await Vehicle.findOne({
      registrationNumber: body.registrationNumber,
    });

    if (exists)
      return res.status(400).json({
        error: "Registration Number already exists",
      });

    const vehicle = await Vehicle.create({
      ...body,
      status: body.status || "Available",
    });

    res.status(201).json(vehicle);
  } catch (err) {
    next(err);
  }
};

// ==============================
// LIST VEHICLES
// ==============================
exports.listVehicles = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      status,
    } = req.query;

    const query = {};

    if (status) query.status = status;

    if (search) {
      query.$or = [
        {
          registrationNumber: {
            $regex: search,
            $options: "i",
          },
        },
        {
          vehicleModel: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const items = await Vehicle.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Vehicle.countDocuments(query);

    res.json({
      items,
      total,
    });
  } catch (err) {
    next(err);
  }
};

// ==============================
// GET VEHICLE
// ==============================
exports.getVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle)
      return res.status(404).json({
        error: "Vehicle not found",
      });

    res.json(vehicle);
  } catch (err) {
    next(err);
  }
};

// ==============================
// UPDATE VEHICLE
// ==============================
exports.updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle)
      return res.status(404).json({
        error: "Vehicle not found",
      });

    if (
      req.body.registrationNumber &&
      req.body.registrationNumber !== vehicle.registrationNumber
    ) {
      const exists = await Vehicle.findOne({
        registrationNumber: req.body.registrationNumber,
      });

      if (exists)
        return res.status(400).json({
          error: "Registration Number already exists",
        });
    }

    Object.assign(vehicle, req.body);

    await vehicle.save();

    res.json(vehicle);
  } catch (err) {
    next(err);
  }
};

// ==============================
// DELETE VEHICLE
// ==============================
exports.deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle)
      return res.status(404).json({
        error: "Vehicle not found",
      });

    const activeTrip = await Trip.findOne({
      vehicle: vehicle._id,
      status: "Dispatched",
    });

    if (activeTrip)
      return res.status(400).json({
        error: "Vehicle is currently on a trip",
      });

    const maintenance = await Maintenance.findOne({
      vehicle: vehicle._id,
      status: "Open",
    });

    if (maintenance)
      return res.status(400).json({
        error: "Vehicle is under maintenance",
      });

    await vehicle.deleteOne();

    res.json({
      message: "Vehicle deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// ==============================
// SET IN MAINTENANCE
// ==============================
exports.setInMaintenance = async (vehicleId) => {
  await Vehicle.findByIdAndUpdate(vehicleId, {
    status: "In Shop",
  });
};

// ==============================
// RESTORE AVAILABLE
// ==============================
exports.setAvailableIfNoOpenMaintenance =
  async (vehicleId) => {
    const openMaintenance =
      await Maintenance.findOne({
        vehicle: vehicleId,
        status: "Open",
      });

    if (!openMaintenance) {
      await Vehicle.findByIdAndUpdate(vehicleId, {
        status: "Available",
      });
    }
  };