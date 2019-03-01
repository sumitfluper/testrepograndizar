const twilio = require('twilio');
const config = require('../config.json');

const sendMessageTwilio = (body, to) => {
    return new Promise((resolve, reject) => {
        var client = new twilio(config.twillio.twilio_accountSid, config.twillio.twilio_authToken);
        client.messages.create({
            body: body,
            to: to, // Text this number
            from: config.twillio.twilio_number // From a valid Twilio number
        }, (err, message) => {
            if (err) {
                reject(err)
            } else {
                resolve(message.sid)
            }
        });
    })
};

exports.sendMessageTwilio = sendMessageTwilio;