const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  registrationNumber: { type: String, required: true, unique: true, index: true },
  vehicleModel: { type: String },
  vehicleType: { type: String },
  maximumLoadCapacity: { type: Number, default: 0 },
  odometer: { type: Number, default: 0 },
  acquisitionCost: { type: Number, default: 0 },
  status: { type: String, enum: ['Available','On Trip','In Shop','Retired'], default: 'Available' },
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
