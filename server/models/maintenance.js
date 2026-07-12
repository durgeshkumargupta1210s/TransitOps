const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  maintenanceType: { type: String },
  description: { type: String },
  cost: { type: Number, default: 0 },
  status: { type: String, enum: ['Open','Closed'], default: 'Open' }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', maintenanceSchema);
