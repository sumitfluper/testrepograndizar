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

var port = process.env.PORT || 3000;
//process.env.NODE_ENV = environment.configuration;
// const allowedExt = [
//     '.js',
//     '.ico',
//     '.css',
//     '.png',
//     '.jpg',
//     '.woff2',
//     '.woff',
//     '.ttf',
//     '.svg',
// ];

mongoose.connect('mongodb://localhost:27017/Gdb');
var db = mongoose.connection;
db.on('error',console.error.bind(console,'mongodb'));
db.once('open', () => console.log('database created'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, './Images/admin')));
app.use(express.static(path.join(__dirname, './Images/users')));
app.use(cors())
// app.use('/',route);
// app.use('/',service_route);
let initRoutes = () => {
	// including all routes
	glob("./routes/*.js", {cwd: path.resolve(path.join(__dirname))}, (err, routes) => {
		if (err) {
			console.log("Error occured including routes");
			return;
		}
		routes.forEach((routePath) => {
			require(routePath).getRouter(app); // eslint-disable-line
		});
		console.log("included " + routes.length + " route files");

		// app.get('**', (req, res) => {
		// 	console.log(req.url);
		// 	if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
		// 		console.log('allowext');
		// 		let url = req.url.split('?')[0];
		// 		res.sendFile(path.resolve(path.join(__dirname,'..','dist',url)));
		// 	} else {
		// 		console.log('else');
		// 		res.sendFile(path.resolve(path.join(__dirname,'..','dist','index.html')));
		// 	}
		// });
	});
}

initRoutes();

app.listen(port,() => {
    console.log('server on port '+port);
})
