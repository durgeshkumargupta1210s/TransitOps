const Trip = require("../models/trip");
const Vehicle = require("../models/vehicle");
const Driver = require("../models/driver");

// ==========================
// CREATE TRIP
// ==========================
exports.createTrip = async (req, res, next) => {
  try {
    const body = req.body;

    const vehicle = await Vehicle.findById(body.vehicle);

    if (!vehicle)
      return res.status(404).json({
        error: "Vehicle not found",
      });

    if (vehicle.status === "Retired")
      return res.status(400).json({
        error: "Retired vehicles cannot be assigned",
      });

    if (vehicle.status === "In Shop")
      return res.status(400).json({
        error: "Vehicle is under maintenance",
      });

    if (vehicle.status === "On Trip")
      return res.status(400).json({
        error: "Vehicle already on another trip",
      });

    if (body.cargoWeight > vehicle.maximumLoadCapacity)
      return res.status(400).json({
        error: "Cargo exceeds vehicle capacity",
      });

    const driver = await Driver.findById(body.driver);

    if (!driver)
      return res.status(404).json({
        error: "Driver not found",
      });

    if (driver.status === "Suspended")
      return res.status(400).json({
        error: "Driver is suspended",
      });

    if (driver.status === "On Trip")
      return res.status(400).json({
        error: "Driver already assigned",
      });

    if (
      new Date(driver.licenseExpiryDate) <
      new Date()
    )
      return res.status(400).json({
        error: "Driver license expired",
      });

    const trip = await Trip.create({
      ...body,
      status: "Draft",
    });

    const populatedTrip = await Trip.findById(
      trip._id
    ).populate("vehicle driver");

    res.status(201).json(populatedTrip);
  } catch (err) {
    next(err);
  }
};

// ==========================
// LIST TRIPS
// ==========================
exports.listTrips = async (req, res, next) => {
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
          source: {
            $regex: search,
            $options: "i",
          },
        },
        {
          destination: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const items = await Trip.find(query)
      .populate("vehicle driver")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total =
      await Trip.countDocuments(query);

    res.json({
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

// ==========================
// GET TRIP
// ==========================
exports.getTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(
      req.params.id
    ).populate("vehicle driver");

    if (!trip)
      return res.status(404).json({
        error: "Trip not found",
      });

    res.json(trip);
  } catch (err) {
    next(err);
  }
};

// ==========================
// DISPATCH TRIP
// ==========================
exports.dispatchTrip = async (
  req,
  res,
  next
) => {
  try {
    const trip = await Trip.findById(
      req.params.id
    );

    if (!trip)
      return res.status(404).json({
        error: "Trip not found",
      });

    if (trip.status !== "Draft")
      return res.status(400).json({
        error:
          "Only Draft trips can be dispatched",
      });

    const vehicle = await Vehicle.findById(
      trip.vehicle
    );

    const driver = await Driver.findById(
      trip.driver
    );

    if (!vehicle || !driver)
      return res.status(400).json({
        error: "Invalid vehicle or driver",
      });

    if (vehicle.status === "Retired")
      return res.status(400).json({
        error: "Vehicle retired",
      });

    if (vehicle.status === "In Shop")
      return res.status(400).json({
        error: "Vehicle under maintenance",
      });

    if (vehicle.status === "On Trip")
      return res.status(400).json({
        error:
          "Vehicle already assigned to another trip",
      });

    if (driver.status === "Suspended")
      return res.status(400).json({
        error: "Driver suspended",
      });

    if (driver.status === "On Trip")
      return res.status(400).json({
        error:
          "Driver already assigned to another trip",
      });

    if (
      new Date(driver.licenseExpiryDate) <
      new Date()
    )
      return res.status(400).json({
        error: "Driver license expired",
      });

    if (
      trip.cargoWeight >
      vehicle.maximumLoadCapacity
    )
      return res.status(400).json({
        error: "Cargo exceeds vehicle capacity",
      });

    trip.status = "Dispatched";

    await trip.save();

    vehicle.status = "On Trip";

    driver.status = "On Trip";

    await vehicle.save();

    await driver.save();

        const updatedTrip = await Trip.findById(
      trip._id
    ).populate("vehicle driver");

    res.json(updatedTrip);
  } catch (err) {
    next(err);
  }
};

// ==========================
// COMPLETE TRIP
// ==========================
exports.completeTrip = async (
  req,
  res,
  next
) => {
  try {
    const {
      actualDistance,
      fuelConsumed,
      finalOdometer,
      revenue,
    } = req.body;

    const trip = await Trip.findById(
      req.params.id
    );

    if (!trip)
      return res.status(404).json({
        error: "Trip not found",
      });

    if (trip.status !== "Dispatched")
      return res.status(400).json({
        error:
          "Only dispatched trips can be completed",
      });

    const vehicle = await Vehicle.findById(
      trip.vehicle
    );

    const driver = await Driver.findById(
      trip.driver
    );

    if (
      finalOdometer &&
      vehicle &&
      finalOdometer < vehicle.odometer
    ) {
      return res.status(400).json({
        error:
          "Final odometer cannot be less than current odometer",
      });
    }

    trip.actualDistance =
      actualDistance ?? trip.actualDistance;

    trip.fuelConsumed =
      fuelConsumed ?? trip.fuelConsumed;

    trip.finalOdometer =
      finalOdometer ?? trip.finalOdometer;

    trip.revenue =
      revenue ?? trip.revenue;

    trip.status = "Completed";

    await trip.save();

    if (vehicle) {
      if (finalOdometer)
        vehicle.odometer = finalOdometer;

      if (vehicle.status !== "Retired")
        vehicle.status = "Available";

      await vehicle.save();
    }

    if (driver) {
      driver.status = "Available";
      await driver.save();
    }

    const updatedTrip = await Trip.findById(
      trip._id
    ).populate("vehicle driver");

    res.json(updatedTrip);
  } catch (err) {
    next(err);
  }
};

// ==========================
// CANCEL TRIP
// ==========================
exports.cancelTrip = async (
  req,
  res,
  next
) => {
  try {
    const trip = await Trip.findById(
      req.params.id
    );

    if (!trip)
      return res.status(404).json({
        error: "Trip not found",
      });

    if (
      trip.status === "Completed" ||
      trip.status === "Cancelled"
    ) {
      return res.status(400).json({
        error:
          "Completed or cancelled trips cannot be cancelled again",
      });
    }

    trip.status = "Cancelled";

    await trip.save();

    const vehicle = await Vehicle.findById(
      trip.vehicle
    );

    const driver = await Driver.findById(
      trip.driver
    );

    if (vehicle) {
      if (vehicle.status !== "Retired") {
        vehicle.status = "Available";
      }

      await vehicle.save();
    }

    if (driver) {
      driver.status = "Available";
      await driver.save();
    }

    const updatedTrip = await Trip.findById(
      trip._id
    ).populate("vehicle driver");

    res.json(updatedTrip);
  } catch (err) {
    next(err);
  }
};

// ==========================
// UPDATE TRIP
// ==========================
exports.updateTrip = async (
  req,
  res,
  next
) => {
  try {
    const trip =
      await Trip.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      ).populate("vehicle driver");

    if (!trip)
      return res.status(404).json({
        error: "Trip not found",
      });

    res.json(trip);
  } catch (err) {
    next(err);
  }
};

// ==========================
// DELETE TRIP
// ==========================
exports.deleteTrip = async (
  req,
  res,
  next
) => {
  try {
    const trip = await Trip.findById(
      req.params.id
    );

    if (!trip)
      return res.status(404).json({
        error: "Trip not found",
      });

    if (trip.status === "Dispatched")
      return res.status(400).json({
        error:
          "Cannot delete an active trip",
      });

    await trip.deleteOne();

    res.json({
      message:
        "Trip deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};