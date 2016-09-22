var express = require('express');
var rout = express();
var router = express.Router();
var mysql = require('mysql');
var connection  = require('express-myconnection');
var bodyParser = require('body-parser');
const util = require('util');

rout.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
rout.use(bodyParser.json()); // support json encoded bodies

var pool = mysql.createPool({
	host     : 'mysql.appnowa.com',
	user     : 'appnowa',
	password : 'q7k9k1',
	database : 'appnowa',
	debug    :  false
})


router.use(function timeLog(req, res, next) {
	console.log('Time: ', Date.now());
	next();
});

function getPrefeitos(req, res){
	pool.getConnection(function(err,connection){
		if (err) {
			connection.release();
			res.json({"code" : 100, "status" : "Error in connection database"});
			return;
		} 

		var cidade = req.params.cidade;


		console.log('connected as id ' + connection.threadId);

		connection.query("SELECT * from wp_prefs WHERE cidade = $1", [cidade],function(err,rows){
			connection.release();
			if(!err) {
				if(rows.length > 0){
					res.json(rows);
					return;
				}
				res.json({"error":"error desconhecido"});
				return;
			}       
		});

		connection.on('error', function(err) {      
			res.json({"error": "Error in connection database"});
			return;     
		});

	});
}


router.get('/:cidade', function(req, res){
	getPrefeitos(req, res);
});


module.exports = router;