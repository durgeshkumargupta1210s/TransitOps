const Expense = require('../models/expense');

exports.createExpense = async (req, res, next) => { try { const e = await Expense.create(req.body); res.json(e);} catch(err){next(err);} }

exports.listExpenses = async (req, res, next) => {
  try {
    const { page=1, limit=20, search } = req.query;
    const q = {};
    if (search) {
      const numeric = Number(search);
      q.$or = [
        { type: new RegExp(search,'i') },
        { vehicle: search },
        ...(Number.isFinite(numeric) ? [{ amount: numeric }] : []),
      ];
    }
    const items = await Expense.find(q).populate('vehicle').skip((page-1)*limit).limit(parseInt(limit));
    const total = await Expense.countDocuments(q);
    res.json({ items, total });
  } catch (err) { next(err); }
}

exports.getExpense = async (req, res, next) => { try { const e = await Expense.findById(req.params.id).populate('vehicle'); if(!e) return res.status(404).json({error:'Not found'}); res.json(e);} catch(err){next(err);} }

exports.deleteExpense = async (req, res, next) => { try { await Expense.findByIdAndDelete(req.params.id); res.json({ ok: true }); } catch (err) { next(err); } }
