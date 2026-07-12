const nodemailer = require("nodemailer");

let transporter = null;

if (
  process.env.EMAIL_HOST &&
  process.env.EMAIL_USER &&
  process.env.EMAIL_PASS
) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

exports.send = async ({
  to,
  subject,
  text,
  html,
}) => {
  try {
    if (!transporter) {
      console.log("Email service disabled.");
      return;
    }

    await transporter.sendMail({
      from: `"TransitOps" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error("Email Error:", err.message);
  }
};