var express = require('express');
var app = express();
var logger = require('morgan');
var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var glob = require('glob')
var cors = require('cors')
// var route = require('./routes/user.routes');
// var service_route = require('./routes/services.route')

const dataRoutes = require('./routes/dataRoutes').Router;
const serviceRoutes = require('./routes/serviceRoutes').Router;
var port = process.env.PORT || 3000;

// mongoose.connect('mongodb://localhost:27017/grandizer',{ useNewUrlParser: true });
var db = mongoose.connection;
db.on('error',console.error.bind(console,'mongodb'));
db.once('open', () => console.log('database created'));

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './Images')));
app.use(cors())

app.use(logger('dev'));
app.use('/api/user',dataRoutes);
app.use('/api/service',serviceRoutes);


app.listen(port,() => {
    console.log('server on port '+port);
})
