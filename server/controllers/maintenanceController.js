const Maintenance = require('../models/maintenance');
const Vehicle = require('../models/vehicle');
const vc = require('./vehicleController');

exports.createMaintenance = async (req, res, next) => {
  try {
    const body = req.body;
    const m = await Maintenance.create(body);
    // set vehicle to In Shop
    await vc.setInMaintenance(body.vehicle);
    res.json(m);
  } catch (err) { next(err); }
}

exports.listMaintenance = async (req, res, next) => {
  try {
    const { page=1, limit=20, status, search } = req.query;
    const q = {};
    if (status) q.status = status;
    if (search) q.$or = [{ maintenanceType: new RegExp(search,'i') }, { description: new RegExp(search,'i') }];
    const items = await Maintenance.find(q).populate('vehicle').skip((page-1)*limit).limit(parseInt(limit));
    const total = await Maintenance.countDocuments(q);
    res.json({ items, total });
  } catch (err) { next(err); }
}

exports.getMaintenance = async (req, res, next) => { try { const m = await Maintenance.findById(req.params.id).populate('vehicle'); if(!m) return res.status(404).json({error:'Not found'}); res.json(m);} catch(err){next(err);} }

exports.closeMaintenance = async (req, res, next) => {
  try {
    const m = await Maintenance.findById(req.params.id);
    if (!m) return res.status(404).json({ error: 'Not found' });
    m.status = 'Closed';
    await m.save();
    await vc.setAvailableIfNoOpenMaintenance(m.vehicle);
    res.json(m);
  } catch (err) { next(err); }
}

exports.deleteMaintenance = async (req, res, next) => { try { await Maintenance.findByIdAndDelete(req.params.id); res.json({ ok: true }); } catch (err) { next(err); } }
