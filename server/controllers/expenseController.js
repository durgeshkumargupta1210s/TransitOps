const Expense = require("../models/expense");
const Vehicle = require("../models/vehicle");

// ==============================
// CREATE EXPENSE
// ==============================
exports.createExpense = async (req, res, next) => {
  try {
    const body = req.body;

    const vehicle = await Vehicle.findById(body.vehicle);

    if (!vehicle)
      return res.status(404).json({
        error: "Vehicle not found",
      });

    const expense = await Expense.create(body);

    const result = await Expense.findById(expense._id).populate("vehicle");

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

// ==============================
// LIST EXPENSES
// ==============================
exports.listExpenses = async (req, res, next) => {
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
          type: {
            $regex: search,
            $options: "i",
          },
        },
        {
          vehicle: search,
        },
        ...(Number.isFinite(numeric)
          ? [{ amount: numeric }]
          : []),
      ];
    }

    const items = await Expense.find(query)
      .populate("vehicle")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Expense.countDocuments(query);

    res.json({
      items,
      total,
    });
  } catch (err) {
    next(err);
  }
};

// ==============================
// GET EXPENSE
// ==============================
exports.getExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate("vehicle");

    if (!expense)
      return res.status(404).json({
        error: "Expense not found",
      });

    res.json(expense);
  } catch (err) {
    next(err);
  }
};

// ==============================
// DELETE EXPENSE
// ==============================
exports.deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense)
      return res.status(404).json({
        error: "Expense not found",
      });

    await expense.deleteOne();

    res.json({
      message: "Expense deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};