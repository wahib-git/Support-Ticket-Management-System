const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});


const sendNotificationEmail = (to, subject, text) => {
  const mailOptions = {
    from: 'wahibbachoua95@gmail.com',
    to,
    subject,
    text,
    
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erreur lors de l\'envoi de l\'email :', error);
    } else {
      console.log('Email envoyé avec succès :', info.response);
    }
  });
};

module.exports = sendNotificationEmail;


