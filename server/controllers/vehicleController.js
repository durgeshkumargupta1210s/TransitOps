const Vehicle = require('../models/vehicle');
const Maintenance = require('../models/maintenance');

exports.createVehicle = async (req, res, next) => {
  try {
    const body = req.body;
    const exists = await Vehicle.findOne({ registrationNumber: body.registrationNumber });
    if (exists) return res.status(400).json({ error: 'Vehicle registrationNumber must be unique' });
    const v = await Vehicle.create(body);
    res.json(v);
  } catch (err) { next(err); }
}

exports.listVehicles = async (req, res, next) => {
  try {
    const { page=1, limit=20, search, status } = req.query;
    const q = {};
    if (search) q.$or = [{ registrationNumber: new RegExp(search,'i') }, { vehicleModel: new RegExp(search,'i') }];
    if (status) q.status = status;
    const items = await Vehicle.find(q).skip((page-1)*limit).limit(parseInt(limit));
    const total = await Vehicle.countDocuments(q);
    res.json({ items, total });
  } catch (err) { next(err); }
}

exports.getVehicle = async (req, res, next) => {
  try { const v = await Vehicle.findById(req.params.id); if (!v) return res.status(404).json({error:'Not found'}); res.json(v); } catch (err) { next(err); }
}

exports.updateVehicle = async (req, res, next) => {
  try {
    const v = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!v) return res.status(404).json({ error: 'Not found' });
    res.json(v);
  } catch (err) { next(err); }
}

exports.deleteVehicle = async (req, res, next) => {
  try { await Vehicle.findByIdAndDelete(req.params.id); res.json({ ok: true }); } catch (err) { next(err); }
}

exports.setInMaintenance = async (vehicleId) => {
  await Vehicle.findByIdAndUpdate(vehicleId, { status: 'In Shop' });
}

exports.setAvailableIfNoOpenMaintenance = async (vehicleId) => {
  const open = await Maintenance.findOne({ vehicle: vehicleId, status: 'Open' });
  if (!open) await Vehicle.findByIdAndUpdate(vehicleId, { status: 'Available' });
}
