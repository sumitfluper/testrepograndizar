var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
const config = require('./services/config.json');
var path = require('path');
var bodyParser = require('body-parser');
var glob = require('glob')
var cors = require('cors')
const indexRoute = require('./routes/index.js');
const attachModelsToRequest = require('./middleware/attachModelsToRequest.js')

// app.use(morgan(':method :url'))
app.use(morgan('combined'));



app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, './Images')));
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
