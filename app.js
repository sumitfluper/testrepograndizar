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
const attachModelsToRequest = require('./middleware/attachModelsToRequest.js')

app.use(morgan(':method :url'));

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(bodyParser.json({limit: '50mb', extended: true}));

app.use(express.static(path.join(__dirname, 'Images')));
app.use(cors())

app.use('/api', attachModelsToRequest, indexRoute);

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
// var db = mongoose.connection;

app.listen(port,() => {
    console.log('server on port '+port);
})
