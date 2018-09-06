// Email sending
const nodemailer = require('nodemailer');
const EmailData = require('../private/email-data');

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

function sendAccountVerificationEmail(firstName, email, code) {
    mailOptions.to = email;
    mailOptions.subject = 'KG Social event invite';
    mailOptions.html = `<p>Hello ${firstName}, please click on the following link to verify your account:</p> 
    <a href="http://localhost:8080/verify/${code}">Confirm assistance</a>`; 
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}

function sendPasswordResetEmail(firstName, email, code) {
    mailOptions.to = email;
    mailOptions.subject = 'KG Social event invite';
    mailOptions.html = `<p>Hello ${firstName}, please click on the following link to reset your password:</p> 
    <a href="http://localhost:8080/resetPassword/${code}">Confirm assistance</a>`; 
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}

function sendInviteEmail(firstName, email, owner, event) {
    mailOptions.to = email;
    mailOptions.subject = 'KG Social event invite';
    mailOptions.html = `<p>Hello ${firstName}, you have been invited to ${event} by ${owner}.</p>`; 
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}

async function sendContactRequestEmails(firstName, email, issueTitle, issueDescription) {
    mailOptions.to = email;
    mailOptions.subject = 'KG Social contact request';
    mailOptions.html = `<p>Hello ${firstName}, this is a copy of your contact us request, please do not reply to this message, the issue sent was:</p>
    <strong>${issueTitle}</strong><p>${issueDescription}</p>`; 
    await transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
    mailOptions.to = EmailData.email;
    mailOptions.subject = 'KG Social contact request';
    mailOptions.html = `<p>${firstName}, just requested help, the issue sent was:</p>
    <strong>${issueTitle}</strong><p>${issueDescription}</p>`; 
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}

async function sendEventCancelledEmails(attendees, title) {
    for(let i in attendees){
        mailOptions.to = attendees[i].user.email;
        mailOptions.subject = 'KG Social event cancelled';
        mailOptions.html = `<p>Hello ${attendees[i].user.firstName}, this email is to notify you that the event ${title} has been cancelled</p>`;
        await transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
    }
}

module.exports = { sendAccountVerificationEmail, sendInviteEmail, sendPasswordResetEmail, 
    sendContactRequestEmails, sendEventCancelledEmails };