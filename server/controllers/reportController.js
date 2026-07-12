const Trip = require("../models/trip");
const Vehicle = require("../models/vehicle");
const Driver = require("../models/driver");
const FuelLog = require("../models/fuellog");
const Expense = require("../models/expense");
const Maintenance = require("../models/maintenance");

// ================= KPIs =================

exports.kpis = async (req, res, next) => {
  try {
    const [
      activeVehicles,
      availableVehicles,
      inMaintenance,
      retired,
      tripsToday,
      pendingTrips,
      driversOnDuty,
    ] = await Promise.all([
      Vehicle.countDocuments({ status: { $ne: "Retired" } }),
      Vehicle.countDocuments({ status: "Available" }),
      Vehicle.countDocuments({ status: "In Shop" }),
      Vehicle.countDocuments({ status: "Retired" }),
      Trip.countDocuments({
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      }),
      Trip.countDocuments({
        status: { $in: ["Draft", "Dispatched"] },
      }),
      Driver.countDocuments({
        status: "On Trip",
      }),
    ]);

    const fuelCost =
      (
        await FuelLog.aggregate([
          {
            $group: {
              _id: null,
              total: { $sum: "$cost" },
            },
          },
        ])
      )[0]?.total || 0;

    const maintenanceCost =
      (
        await Maintenance.aggregate([
          {
            $group: {
              _id: null,
              total: { $sum: "$cost" },
            },
          },
        ])
      )[0]?.total || 0;

    const expenseCost =
      (
        await Expense.aggregate([
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
            },
          },
        ])
      )[0]?.total || 0;

    const revenue =
      (
        await Trip.aggregate([
          {
            $match: {
              status: "Completed",
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$revenue" },
            },
          },
        ])
      )[0]?.total || 0;

    const fuelEfficiency =
      (
        await Trip.aggregate([
          {
            $match: {
              status: "Completed",
            },
          },
          {
            $group: {
              _id: null,
              distance: {
                $sum: "$actualDistance",
              },
              fuel: {
                $sum: "$fuelConsumed",
              },
            },
          },
          {
            $project: {
              efficiency: {
                $cond: [
                  { $eq: ["$fuel", 0] },
                  0,
                  { $divide: ["$distance", "$fuel"] },
                ],
              },
            },
          },
        ])
      )[0]?.efficiency || 0;

    res.json({
      activeVehicles,
      availableVehicles,
      inMaintenance,
      retired,
      tripsToday,
      pendingTrips,
      driversOnDuty,
      fuelCost,
      maintenanceCost,
      expenseCost,
      operationalCost:
        fuelCost + maintenanceCost + expenseCost,
      revenue,
      fuelEfficiency,
    });
  } catch (err) {
    next(err);
  }
};

// ================= REPORTS =================

exports.reports = async (req, res, next) => {
  try {
    const { type } = req.query;

    switch (type) {
      case "fuel-efficiency":
        return res.json(
          await Trip.aggregate([
            { $match: { status: "Completed" } },
            {
              $group: {
                _id: "$vehicle",
                totalDistance: {
                  $sum: "$actualDistance",
                },
                totalFuel: {
                  $sum: "$fuelConsumed",
                },
              },
            },
            {
              $project: {
                vehicle: "$_id",
                efficiency: {
                  $cond: [
                    { $eq: ["$totalFuel", 0] },
                    0,
                    {
                      $divide: [
                        "$totalDistance",
                        "$totalFuel",
                      ],
                    },
                  ],
                },
              },
            },
          ])
        );

      case "trips-per-vehicle":
        return res.json(
          await Trip.aggregate([
            {
              $group: {
                _id: "$vehicle",
                trips: { $sum: 1 },
              },
            },
          ])
        );

      case "trips-per-driver":
        return res.json(
          await Trip.aggregate([
            {
              $group: {
                _id: "$driver",
                trips: { $sum: 1 },
              },
            },
          ])
        );

      case "monthly-expenses":
        return res.json(
          await Expense.aggregate([
            {
              $group: {
                _id: {
                  month: {
                    $month: "$date",
                  },
                  year: {
                    $year: "$date",
                  },
                },
                total: {
                  $sum: "$amount",
                },
              },
            },
            {
              $sort: {
                "_id.year": 1,
                "_id.month": 1,
              },
            },
          ])
        );

      case "expense-distribution":
        return res.json(
          await Expense.aggregate([
            {
              $group: {
                _id: "$type",
                total: {
                  $sum: "$amount",
                },
              },
            },
          ])
        );

      case "maintenance-trend":
        return res.json(
          await Maintenance.aggregate([
            {
              $group: {
                _id: {
                  month: {
                    $month: "$createdAt",
                  },
                  year: {
                    $year: "$createdAt",
                  },
                },
                total: {
                  $sum: "$cost",
                },
              },
            },
            {
              $sort: {
                "_id.year": 1,
                "_id.month": 1,
              },
            },
          ])
        );

      case "fleet-utilization":
        return res.json(
          await Vehicle.aggregate([
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ])
        );

      case "revenue-vs-cost": {
        const revenue =
          (
            await Trip.aggregate([
              {
                $match: {
                  status: "Completed",
                },
              },
              {
                $group: {
                  _id: null,
                  value: {
                    $sum: "$revenue",
                  },
                },
              },
            ])
          )[0]?.value || 0;

        const fuel =
          (
            await FuelLog.aggregate([
              {
                $group: {
                  _id: null,
                  value: {
                    $sum: "$cost",
                  },
                },
              },
            ])
          )[0]?.value || 0;

        const maintenance =
          (
            await Maintenance.aggregate([
              {
                $group: {
                  _id: null,
                  value: {
                    $sum: "$cost",
                  },
                },
              },
            ])
          )[0]?.value || 0;

        const expenses =
          (
            await Expense.aggregate([
              {
                $group: {
                  _id: null,
                  value: {
                    $sum: "$amount",
                  },
                },
              },
            ])
          )[0]?.value || 0;

        return res.json([
          { name: "Revenue", value: revenue },
          { name: "Fuel", value: fuel },
          { name: "Maintenance", value: maintenance },
          { name: "Expenses", value: expenses },
        ]);
      }

      case "vehicle-roi":
        return res.json(
          await Trip.aggregate([
            {
              $match: {
                status: "Completed",
              },
            },
            {
              $group: {
                _id: "$vehicle",
                revenue: {
                  $sum: "$revenue",
                },
                trips: {
                  $sum: 1,
                },
              },
            },
          ])
        );

      default:
        return res
          .status(400)
          .json({ error: "Unknown report type" });
    }
  } catch (err) {
    next(err);
  }
};