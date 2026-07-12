const Driver = require("../models/driver");
const Trip = require("../models/trip");

// ==============================
// CREATE DRIVER
// ==============================
exports.createDriver = async (req, res, next) => {
  try {
    const body = req.body;

    const exists = await Driver.findOne({
      licenseNumber: body.licenseNumber,
    });

    if (exists)
      return res.status(400).json({
        error: "License Number already exists",
      });

    if (
      body.licenseExpiryDate &&
      new Date(body.licenseExpiryDate) < new Date()
    ) {
      return res.status(400).json({
        error: "License already expired",
      });
    }

    const driver = await Driver.create({
      ...body,
      status: body.status || "Available",
    });

    res.status(201).json(driver);
  } catch (err) {
    next(err);
  }
};

// ==============================
// LIST DRIVERS
// ==============================
exports.listDrivers = async (req, res, next) => {
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
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          licenseNumber: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const items = await Driver.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Driver.countDocuments(query);

    res.json({
      items,
      total,
    });
  } catch (err) {
    next(err);
  }
};

// ==============================
// GET DRIVER
// ==============================
exports.getDriver = async (req, res, next) => {
  try {
    const driver = await Driver.findById(req.params.id);

    if (!driver)
      return res.status(404).json({
        error: "Driver not found",
      });

    res.json(driver);
  } catch (err) {
    next(err);
  }
};

// ==============================
// UPDATE DRIVER
// ==============================
exports.updateDriver = async (req, res, next) => {
  try {
    const driver = await Driver.findById(req.params.id);

    if (!driver)
      return res.status(404).json({
        error: "Driver not found",
      });

    if (
      req.body.licenseNumber &&
      req.body.licenseNumber !== driver.licenseNumber
    ) {
      const exists = await Driver.findOne({
        licenseNumber: req.body.licenseNumber,
      });

      if (exists)
        return res.status(400).json({
          error: "License Number already exists",
        });
    }

    if (
      req.body.licenseExpiryDate &&
      new Date(req.body.licenseExpiryDate) < new Date()
    ) {
      return res.status(400).json({
        error: "License already expired",
      });
    }

    Object.assign(driver, req.body);

    await driver.save();

    res.json(driver);
  } catch (err) {
    next(err);
  }
};

// ==============================
// DELETE DRIVER
// ==============================
exports.deleteDriver = async (req, res, next) => {
  try {
    const driver = await Driver.findById(req.params.id);

    if (!driver)
      return res.status(404).json({
        error: "Driver not found",
      });

    const activeTrip = await Trip.findOne({
      driver: driver._id,
      status: "Dispatched",
    });

    if (activeTrip)
      return res.status(400).json({
        error: "Driver is currently on a trip",
      });

    await driver.deleteOne();

    res.json({
      message: "Driver deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};