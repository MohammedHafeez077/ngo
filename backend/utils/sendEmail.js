const nodemailer = require("nodemailer");

const transporter = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
  : null;

const sendEmail = async ({ to, subject, text }) => {
  if (!transporter) {
    console.log(`Email queued to ${to}: ${subject} - ${text}`);
    return true;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text
  });

  return true;
};

module.exports = sendEmail;
