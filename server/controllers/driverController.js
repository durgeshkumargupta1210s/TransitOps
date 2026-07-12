const Driver = require('../models/driver');

exports.createDriver = async (req, res, next) => {
  try {
    const body = req.body;
    const d = await Driver.create(body);
    res.json(d);
  } catch (err) { next(err); }
}

exports.listDrivers = async (req, res, next) => {
  try {
    const { page=1, limit=20, search, status } = req.query;
    const q = {};
    if (search) q.$or = [{ name: new RegExp(search,'i') }, { licenseNumber: new RegExp(search,'i') }];
    if (status) q.status = status;
    const items = await Driver.find(q).skip((page-1)*limit).limit(parseInt(limit));
    const total = await Driver.countDocuments(q);
    res.json({ items, total });
  } catch (err) { next(err); }
}

exports.getDriver = async (req, res, next) => {
  try { const d = await Driver.findById(req.params.id); if (!d) return res.status(404).json({error:'Not found'}); res.json(d); } catch (err) { next(err); }
}

exports.updateDriver = async (req, res, next) => {
  try { const d = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true }); if (!d) return res.status(404).json({error:'Not found'}); res.json(d); } catch (err) { next(err); }
}

exports.deleteDriver = async (req, res, next) => {
  try { await Driver.findByIdAndDelete(req.params.id); res.json({ ok: true }); } catch (err) { next(err); }
}
