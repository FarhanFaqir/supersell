const nodemailer = require('nodemailer');
const sendgridMail = require('@sendgrid/mail');

sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendEmail(to, subject, html) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    });

  const mailOptions = {
      from: "info@SuperSell.app",
      to,
      subject,
      html
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
        reject(error);
      } else {
        console.log('Email sent:', info);
        resolve(info);
      }
    });
  });
}

module.exports = sendEmail;
