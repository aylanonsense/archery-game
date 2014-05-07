//configure requirejs
var requirejs = require('requirejs');
requirejs.config({ baseUrl: __dirname, nodeRequire: require });
require = requirejs;

//load dependencies
var config = require('config');
var express = require('express');
var lessMiddleware = require('less-middleware');

//set up server
var app = express();
app.use(lessMiddleware({ src: __dirname + "/public", compress: true }));
app.use(express.static(__dirname + '/public'));

//add routes
app.get('/', function(req, res) {
	res.render('index.jade', {});
});

//start server
app.listen(config.server.port);