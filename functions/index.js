'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

const gmailEmail = functions.config().gmail.login;
const gmailPassword = functions.config().gmail.pass;


var goMail = function (data, isContactForm = false) {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: gmailEmail,
            pass: gmailPassword
        },
    });

    let mailOptions = {};

    if(isContactForm) {
        mailOptions = {
            from: gmailEmail, // sender address
            to: gmailEmail, // list of receivers
            subject: 'Contact Form  ✔ ' + data.subject, // Subject line
            text: ' - ' + data.mail + ' - ' + data.data, // plain text body
            html: '<h2>New Contact Form Submission</h2><br><br>' +
                'Name: ' + data.name + '<br>' +
                'Email: ' + data.email + '<br>' +
                'Subject: ' + data.subject + '<br>' +
                'data: ' + data.message + '<br>'
        };
    } else {
        mailOptions = {
            from: gmailEmail, // sender address
            to: gmailEmail, // list of receivers
            subject: 'Call To Action Form  ✔', // Subject line
            text: ' - ' + data, // plain text body
            html: 'Received a new CTA email from : ' + data // html body
        };
    }

    const getDeliveryStatus = function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    };

    transporter.sendMail(mailOptions, getDeliveryStatus);
    return true;
};

//.onDataAdded watches for changes in database

// Call To Action
exports.onDataAdded = functions.database.ref('/callToAction/{sessionId}').onCreate(function (snap, context) {
    const createdData = snap.val();
    console.log('Created Data CTA : %s', createdData);
    return goMail(text);
});

// Contact Form
exports.onDataAdded = functions.database.ref('/contacts/{sessionId}').onCreate(function (snap, context) {
    const createdData = snap.val();
    console.log('Created Data Contact : %s', createdData);
    return goMail(createdData, true);
});