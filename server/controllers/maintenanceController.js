const Maintenance = require("../models/maintenance");
const Vehicle = require("../models/vehicle");

// ==============================
// CREATE MAINTENANCE
// ==============================
exports.createMaintenance = async (req, res, next) => {
  try {
    const body = req.body;

    const vehicle = await Vehicle.findById(body.vehicle);

    if (!vehicle)
      return res.status(404).json({
        error: "Vehicle not found",
      });

    if (vehicle.status === "Retired")
      return res.status(400).json({
        error: "Retired vehicle cannot be maintained",
      });

    if (vehicle.status === "On Trip")
      return res.status(400).json({
        error: "Vehicle is currently on trip",
      });

    const openMaintenance = await Maintenance.findOne({
      vehicle: body.vehicle,
      status: "Open",
    });

    if (openMaintenance)
      return res.status(400).json({
        error: "Vehicle already under maintenance",
      });

    const maintenance = await Maintenance.create({
      ...body,
      status: "Open",
    });

    vehicle.status = "In Shop";
    await vehicle.save();

    const result = await Maintenance.findById(
      maintenance._id
    ).populate("vehicle");

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

// ==============================
// LIST MAINTENANCE
// ==============================
exports.listMaintenance = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      search,
    } = req.query;

    const query = {};

    if (status) query.status = status;

    if (search) {
      query.$or = [
        {
          maintenanceType: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const items = await Maintenance.find(query)
      .populate("vehicle")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total =
      await Maintenance.countDocuments(query);

    res.json({
      items,
      total,
    });
  } catch (err) {
    next(err);
  }
};

// ==============================
// GET MAINTENANCE
// ==============================
exports.getMaintenance = async (
  req,
  res,
  next
) => {
  try {
    const maintenance =
      await Maintenance.findById(
        req.params.id
      ).populate("vehicle");

    if (!maintenance)
      return res.status(404).json({
        error: "Maintenance not found",
      });

    res.json(maintenance);
  } catch (err) {
    next(err);
  }
};

// ==============================
// CLOSE MAINTENANCE
// ==============================
exports.closeMaintenance = async (
  req,
  res,
  next
) => {
  try {
    const maintenance =
      await Maintenance.findById(
        req.params.id
      );

    if (!maintenance)
      return res.status(404).json({
        error: "Maintenance not found",
      });

    maintenance.status = "Closed";

    await maintenance.save();

    const vehicle = await Vehicle.findById(
      maintenance.vehicle
    );

    if (
      vehicle &&
      vehicle.status !== "Retired"
    ) {
      vehicle.status = "Available";
      await vehicle.save();
    }

    const result = await Maintenance.findById(
      maintenance._id
    ).populate("vehicle");

    res.json(result);
  } catch (err) {
    next(err);
  }
};

// ==============================
// DELETE MAINTENANCE
// ==============================
exports.deleteMaintenance = async (
  req,
  res,
  next
) => {
  try {
    const maintenance =
      await Maintenance.findById(
        req.params.id
      );

    if (!maintenance)
      return res.status(404).json({
        error: "Maintenance not found",
      });

    await maintenance.deleteOne();

    res.json({
      message:
        "Maintenance deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};