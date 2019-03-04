var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
 
 

 
 
 // parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// parse requests of content-type - application/json
app.use(bodyParser.json())

app.get("/", function(req, res) {
     res.json( "Api is running");
});

// Require Notes routes
require('./routes/user.routes.js')(app);

 app.listen(3000, function(a) {
     console.log("Listening to port 3000");
 });
