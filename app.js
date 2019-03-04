// var express = require('express');
// var bodyParser = require('body-parser');
// var app = express();
// var path = require('path');
 
 

 
 
//  // parse requests of content-type - application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }))
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');
// // parse requests of content-type - application/json
// app.use(bodyParser.json())

// app.get("/", function(req, res) {
//      res.json( "Api is running");
// });

// // Require Notes routes
// require('./routes/user.routes.js')(app);

//  app.listen(3000, function(a) {
//      console.log("Listening to port 3000");
//  });

var express = require('express');
var app = express();
var logger = require('morgan');
var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var route = require('./routes/user.routes');

var port = process.env.PORT || 3000;
//process.env.NODE_ENV = environment.configuration;

mongoose.connect('mongodb://localhost:27017/Gdb');
var db = mongoose.connection;
db.on('error',console.error.bind(console,'mongodb'));
db.once('open', () => console.log('database created'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, './src/uploads')));
app.use('/',route);

app.listen(port,() => {
    console.log('server on port '+port);
})
