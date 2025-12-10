const nodemailer = require("nodemailer");

const EMAIL = process.env.GOOGLE_EMAIL;
const PASSWORD = process.env.GOOGLE_PASSWORD;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
});

async function sendOtpEmail(to, otp) {
  const mailOptions = {
    from: EMAIL,
    to,
    subject: "Your Car Maintenance Tracker OTP Code",
    text: `Your OTP code is: ${otp}\nIt will expire in 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendOtpEmail };
