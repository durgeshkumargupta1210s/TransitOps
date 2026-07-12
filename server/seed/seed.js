require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');
const Vehicle = require('../models/vehicle');
const Driver = require('../models/driver');
const bcrypt = require('bcrypt');

async function run(){
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/transitops');
  console.log('Connected');
  await User.deleteMany({});
  const admin = await User.create({ name: 'Admin', email: 'admin@transitops.com', password: await bcrypt.hash('password',10), role: 'Fleet Manager' });
  const dispatcher = await User.create({ name: 'Dispatch', email: 'dispatch@transitops.com', password: await bcrypt.hash('password',10), role: 'Dispatcher' });
  console.log('Users created');

  await Vehicle.deleteMany({});
  const v1 = await Vehicle.create({ registrationNumber: 'ABC-1001', vehicleModel: 'Volvo X1', vehicleType: 'Truck', maximumLoadCapacity: 10000, odometer: 10000, acquisitionCost: 50000 });
  const v2 = await Vehicle.create({ registrationNumber: 'ABC-1002', vehicleModel: 'Isuzu M2', vehicleType: 'Van', maximumLoadCapacity: 2000, odometer: 25000, acquisitionCost: 30000 });
  console.log('Vehicles created');

  await Driver.deleteMany({});
  await Driver.create({ name: 'John Doe', licenseNumber: 'L-1001', licenseCategory: 'C', licenseExpiryDate: new Date(Date.now() + 1000*60*60*24*365), contactNumber: '555-0100' });
  await Driver.create({ name: 'Jane Roe', licenseNumber: 'L-1002', licenseCategory: 'B', licenseExpiryDate: new Date(Date.now() + 1000*60*60*24*30), contactNumber: '555-0101' });
  console.log('Drivers created');

  console.log('Seed complete');
  process.exit(0);
}

run().catch(err=>{ console.error(err); process.exit(1); });
