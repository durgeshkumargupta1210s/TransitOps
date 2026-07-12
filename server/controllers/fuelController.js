const FuelLog = require('../models/fuellog');

exports.createFuelLog = async (req, res, next) => {
  try { const f = await FuelLog.create(req.body); res.json(f); } catch (err) { next(err); }
}

exports.listFuelLogs = async (req, res, next) => {
  try {
    const { page=1, limit=20, search } = req.query;
    const q = {};
    if (search) {
      const numeric = Number(search);
      q.$or = [
        { vehicle: search },
        ...(Number.isFinite(numeric) ? [{ liters: numeric }, { cost: numeric }] : []),
      ];
    }
    const items = await FuelLog.find(q).populate('vehicle').skip((page-1)*limit).limit(parseInt(limit));
    const total = await FuelLog.countDocuments(q);
    res.json({ items, total });
  } catch (err) { next(err); }
}

exports.getFuelLog = async (req, res, next) => { try { const f = await FuelLog.findById(req.params.id).populate('vehicle'); if(!f) return res.status(404).json({error:'Not found'}); res.json(f);} catch(err){next(err);} }

exports.deleteFuelLog = async (req, res, next) => { try { await FuelLog.findByIdAndDelete(req.params.id); res.json({ ok: true }); } catch (err) { next(err); } }
