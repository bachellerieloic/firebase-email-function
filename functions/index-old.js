'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');


const gmailEmail = functions.config().gmail.login;
const gmailPassword = functions.config().gmail.pass;

admin.initializeApp();


var goMail = function (message, isContact = false) {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: gmailEmail,
            pass: gmailPassword
        },
    });

    let mailOptions = {}
    if(isContact) {
        mailOptions = {
            from: gmailEmail, // sender address
            to: 'bachellerieloic@gmail.com', // list of receivers
            subject: 'Contact Form  ✔ ' + message.subject, // Subject line
            text: ' - ' + message.mail + ' - ' + message.message, // plain text body
            html: ' Name: ' + message.name + '/n' +
            'Email: ' + message.email + '/n' +
            'Subject: ' + message.subject + '/n' +
            'Message: ' + message.message + '/n'
        };
    } else {
        mailOptions = {
            from: gmailEmail, // sender address
            to: 'bachellerieloic@gmail.com', // list of receivers
            subject: 'Call To Action Form  ✔', // Subject line
            text: ' - ' + message, // plain text body
            html: ' Email ' + message // html body
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
    var text = createdData;
    console.log('Created Data CTA : %s', createdData);
    return goMail(text);
});

// Contact Form
exports.onDataAdded = functions.database.ref('/contacts/{sessionId}').onCreate(function (snap, context) {
    const createdData = snap.val();
    var text = createdData;
    console.log('Created Data Contact : %s', createdData);
    return goMail(createdData, true);
});
