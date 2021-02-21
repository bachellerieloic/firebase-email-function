'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const mailjet = require ('node-mailjet')
    .connect('efec36e0974e64034af10641df59b1ba', '1519332e8a2d44b26e07a629f7e632fd')

admin.initializeApp();

// Call To Action
exports.onEmailAdded = functions.firestore
    .document('/callToActionEmails/{docId}')
    .onCreate((snap, context) => {
        try {
            const emailAddress = snap.data().email
            // console.log('Finlo Landing - Added New Email - : %s', snap.data().email);
            return sendEmail(emailAddress)
        } catch (error) {
            console.log('ERROR', error)
        }
    });

const sendEmail = (emailAddress) => {
    const request = mailjet
        .post("send", {'version': 'v3.1'})
        .request({
            "Messages":[
                {
                    "From": {
                        "Email": "info@finlo.io",
                        "Name": "Loic"
                    },
                    "To": [
                        {
                            "Email": emailAddress,
                            "Name": "Finlo User"
                        }
                    ],
                    "Subject": "Greetings from Finlo.io.",
                    "TextPart": "My first Mailjet email",
                    "HTMLPart": "<h3>Dear Finlo future user, welcome to <a href='https://finlo.io/'>Finlo.io</a>!</h3><br /> " +
                        "We are currently working very hard to launch this platform, " +
                        "any suggestion is welcome! Feel free to reply to this email!",
                    "CustomID": "AppGettingStartedTest"
                }
            ]
        })
    request
        .then((result) => {
            // console.log(result.body)
        })
        .catch((err) => {
            console.log(err.statusCode)
        })
}
