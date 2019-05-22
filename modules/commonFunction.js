var twilio  = require( 'twilio');
var config = require('../services/config');
var firebase = require("firebase-admin");
//  var FCM = require('fcm-node');

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

exports.createFirebaseNode = (id, name, profile_image) => {
    console.log("comming to firebase node.");
    id = id.toString();
    var ref = firebase.app().database().ref();

    var usersRef = ref.child("users").child(id);
    var userRef = usersRef.push();
    console.log("user key", userRef.key);
    var userRef = usersRef.set({
        userName: name,
        profilePic: profile_image,
        id :id
    });
}