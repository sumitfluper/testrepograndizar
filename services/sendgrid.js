const nodeMailerModule =  require('nodemailer');
const nodemailer = nodeMailerModule; 
const config =  require('../config.json');
const smtpTransport = require('nodemailer-smtp-transport');

//AWSEmail

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(config.SendGrid.SENDGRID_API_KEY);

exports.sendEmailViaSendgrid = (to, subject, html) => {

    exports.sendEmailViaAWS(to, subject, html);
    // const msg = {
    //     to,
    //     from: config.emailCredentials.From,
    //     subject,
    //     // text: 'and easy to do anywhere, even with Node.js',
    //     html
    // };

    // return sgMail.send(msg);
}

const SendGrid = {
    "host": config.SendGrid.SendGrid_host,
    "auth": {
        "user": config.SendGrid.SendGrid_auth.SendGrid_user,
        "pass": config.SendGrid.SendGrid_auth.SendGrid_pass
    }
}

const transporter = nodeMailerModule.createTransport(smtpTransport(SendGrid));

exports.sendEmailViaTemplate = (to, subject, html) => {

    exports.sendEmailViaSendgrid(to, subject, html);
    // var mailOptions = {
    //     from: config.emailCredentials.From,
    //     to: to,
    //     subject: subject,
    //     html: html
    // };
    // transporter.sendMail(mailOptions, function (error, info) {
    //     console.log('Mail Sent Callback Error:', error);
    //     console.log('Mail Sent Callback Ifo:', info);
    // });
}

/**
 * Send Email using AWS Credentials.
 *  
 * @param {*} to 
 * @param {*} subject 
 * @param {*} html 
 */
exports.sendEmailViaAWS = (to, subject, html) => {

    let transporter = nodemailer.createTransport(config.AWSEmail);

    var mailOptions = {
        from: config.emailCredentials.From,
        to: to,
        subject: subject,
        html: html
    };

    transporter.sendMail(mailOptions, function (error, info) {
        console.log('Mail Sent Callback Error:', error);
        console.log('Mail Sent Callback Ifo:', info);
    });
}
