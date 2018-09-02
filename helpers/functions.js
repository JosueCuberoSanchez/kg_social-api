// Email sending
const nodemailer = require('nodemailer');
const EmailData = require('../private/email-data');
const Constants = require('../helpers/constants');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: EmailData.email,
        pass: EmailData.password
    }
});

let mailOptions = {
    from: '"KG Social" <jo96cube@gmail.com>', // sender address
    to: '', // list of receivers
    subject: '', // Subject line
    html: '', // plaintext body
};

function sendEmail(firstName, lastName, email, code, type) {
    mailOptions.to = email;
    let message;
    if(type === Constants.FORGOT_PASSWORD){
        mailOptions.subject = 'KG Social reset password request';
        mailOptions.html = `<p>Hello, please click on the following link to reset your password:</p> 
        <a href="http://localhost:8080/resetPassword/${code}">Reset password</a>`; 
    } else {
        mailOptions.subject = 'KG Social account verification';
        mailOptions.html = `<p>Hello ${firstName} ${lastName}, 
        please click on the following link to verify your account:</p> 
        <a href="http://localhost:8080/verify/${code}">Verify account</a>`;
    }
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}

module.exports = { sendEmail };