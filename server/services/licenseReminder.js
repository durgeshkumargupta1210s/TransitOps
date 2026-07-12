const Driver = require("../models/driver");
const emailService = require("./emailService");

exports.checkExpiries = async () => {
  try {
    const reminderDate = new Date();
    reminderDate.setDate(reminderDate.getDate() + 15);

    const drivers = await Driver.find({
      licenseExpiryDate: { $lte: reminderDate },
      status: { $ne: "Suspended" },
    });

    for (const driver of drivers) {
      if (!driver.email) continue;

      await emailService.send({
        to: driver.email,
        subject: "Driver License Expiry Reminder",
        text: `Hello ${driver.name},

Your driving license will expire on ${driver.licenseExpiryDate.toDateString()}.

Please renew it before the expiry date.

Regards,
TransitOps Team`,
      });
    }

    console.log(
      `License reminder completed. ${drivers.length} driver(s) checked.`
    );
  } catch (err) {
    console.error("License Reminder Error:", err.message);
  }
};