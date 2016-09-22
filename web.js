//var pg = require('pg');
var express = require("express");
var app = express();
var laboratorio = require('./laboratorio');
var prefeitos = require('./prefeitos');
var exames = require('./exames');
var router = express.Router();
var bodyParser = require('body-parser');
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.json()); // support json encoded bodies


app.use('/laboratorio', laboratorio);
app.use('/prefeitos', prefeitos);

app.use('/exames', exames);


var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on " + port);
});