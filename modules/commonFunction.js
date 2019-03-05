var twilio  = require( 'twilio');
var config = require('../services/config');
/*
 * -----------------------
 * GENERATE RANDOM STRING
 * -----------------------
 */
 exports.generateRandomString = () => {
	 let text = "";
	 let possible = "123456789";

	 for (var i = 0; i < 4; i++)
	 	text += possible.charAt(Math.floor(Math.random() * possible.length));

	return '1234';
};
exports.sendotp = (verification_code,sendTo) => {
	let accountSid = config.accountSid;
	let authToken =config.authToken;
	var client = new twilio(accountSid,authToken);
	console.log(verification_code + " " + sendTo)
	client.messages.create({
	    body: "your one time password(OTP) is  "  +verification_code+  "  valid for 3 minutes do not disclose it" ,
	    to: sendTo,  // Text this number
	    from: '(805) 464-3431' // From a valid Twilio number
	})
	.then((message) => console.log(message.sid))
	.catch((err) => console.log(err));
};