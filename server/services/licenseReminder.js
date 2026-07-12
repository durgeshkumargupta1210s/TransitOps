const Driver = require('../models/driver');
const email = require('./emailService');

exports.checkExpiries = async () => {
  const soon = new Date(Date.now() + 1000*60*60*24*15);
  const drivers = await Driver.find({ licenseExpiryDate: { $lte: soon } });
  for (const d of drivers){
    const to = d.contactNumber + '@example.com'; // placeholder
    await email.send({ to, subject: 'License expiring soon', text: `License for ${d.name} expires on ${d.licenseExpiryDate}` });
  }
}
