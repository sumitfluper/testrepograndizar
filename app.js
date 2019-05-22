const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const config = require('./services/config.json');
const path = require('path');
const bodyParser = require('body-parser');
const glob = require('glob')
const cors = require('cors')
const indexRoute = require('./routes/index.js');
var firebase = require("firebase-admin");

app.use(bodyParser.urlencoded({limit: '150mb', extended: true,parameterLimit: 1000000}))
app.use(bodyParser.json({limit: '150mb', extended: true}));

var config = {
    "type": "service_account",
    "project_id": "charged-mind-234610",
    "private_key_id": "f91f49d4bad15d3d49d3bb14aad64d19726e05ef",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCzxtW6JUajyAfF\nxYOvj8PJPvRl0GDrobgVtOleqzZ+bqxDyMv5nEODHZJ+DwzdPbVQQBfIxwWu89r/\nQipZLgOJEBTi0ExAOShcdIrOq68OJiJJ8OAinYj2QNaQIvyLqcSpZNxT33mTkgIK\nLaxP5b+AjJFdJrzpV7QyzB0TC0fK6WtX5qBs4cKgJuFFbav0EOjSpSvaSP7d+Moz\nsAOXOZSs/PVrMm+32z/78tH9tb+i9GO01snZT1iymSuhqw9XWgX1/onG27aD/cba\nCmD7/oj5RNaiar7F2zdEixEhEhgMt/m3cD6Ird1HTGffO0I6JKPexKLsKCS3VkWu\nQE7r9LShAgMBAAECggEABZnNeUvlgD9AXL07TconEZs8PnrINjcW1thIx/oCC9zT\nUZZNIoTnhotyj6pU3oSoZCxnAUqQBwQSX872JkqcchX17J4MLhkJxJ2d4HPxU3nF\nKjQOq41oYbGh7aIlZ419ssBRa+yDq2EKXrpPCrsv5OecNMB69LMWilmZE0mP7kab\ngVcQfGgUmLVaeRuVF03Qn785AH8ceDl+0ptMWMh7qf9zQakaRKMGznillSkGAj0F\n3lOEezWLt2IWONxW4zm+4OwCLYjQQIvA2+WNvsERWaRRT2QK4yb+CtFVRi3ffaV9\ndoIVhuQ/PodM8jVmKR9YJvRYcPtiQsb2qnoRtidcUQKBgQDd3W3883ngH5M81zy0\nSI3WSxzfzmLYp/Bji88ZK8lbhqOr8fd/katv9l5F2AbElmpqTjuVHhtVVfUIAMKP\nrTSgap17mVIQqwt4rFcN6mK3Fm8/hyZaM3Xegb26DEjsnl6mMu8S5tNRLq2eWyBD\n2Q/fisV3O94noIsNzs/bo6ldOQKBgQDPb636tn17RrAEyrd6ZUc2EVDYwtFvHD1e\nhkLIXjtZiEIfPLAmAJkEBkaVgyyfzN84lMrwLmUkIIN2u4NQq1oTXdESf4n88X1N\n0J1lZhPMR78PCkvZf4JxRAZIoRoVNFyimli66pKXiLzx41pcEZaA5cEei4rgAuyD\ntJdzuYF6qQKBgAY0kEP351u+ZlbYSklckiMBPNCBrEAVCmMuYN96WwplTKSdgued\ngmcCRAa+EQpkjptkjsQP8IHFgrHzm317QbKO6NKxKhtvPUXlxBWOja5DQV9Mf2Uc\ndVqA1Hakq1F66HjLieZEcHqfzJlWQSPEqW3+KqG4GfGPyvPa6fNhs3X5AoGBAKX8\nLlIUnpn7OTPMZj6pNe88sd2RHnbzOOQfOOcOCB2fW5GVRTpTdh1zTB2tJhMEo4Wq\nAi1oYoQjBC8I4o21X1Fp27camPbu4Z5XlOqjYKowquBFE+aJEn7BuOl7B9z51jpC\nmUeQFhbtUouXqiFL7YtczUg8zrZrgIfvBNWUFdhpAoGAD9qsLKNPSrnL/P/deFa4\nIgD5Q7t/tO89r0giElwzln8YIjSpx7VisfhSpQH8ueBjtgTvkfUSC0ddR4l1n1NW\n/CTpsDBybaYBOXOmaaJWCneDjwysMeqRLRC1jwuDoYxmr6VMsMDMpMA/TNHguUl4\nFIyajo6dO3ysif2Mj1XEgGw=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-6di4p@charged-mind-234610.iam.gserviceaccount.com",
    "client_id": "109928781414178787614",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-6di4p%40charged-mind-234610.iam.gserviceaccount.com"
  }

firebase.initializeApp({
	credential: firebase.credential.cert(config),
	databaseURL: 'https://charged-mind-234610.firebaseio.com'
});




app.use(express.static(path.join(__dirname, 'Images')));
app.use(cors())

app.use('/api', morgan(':method :url'), indexRoute);

// check env of the application and connect to the database accordingly 
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(config.db, {
        useNewUrlParser: true,
        useCreateIndex: true
    });
    console.log('Running in Development Mode....');
} else {
    mongoose.connect(config.test_db, {
        useNewUrlParser: true,
        useCreateIndex: true
    });
    console.log('Running in Testing Mode....');
}


var port = process.env.PORT || 3000;

app.listen(port,() => {
    console.log(`server on port ${port}`);
})
