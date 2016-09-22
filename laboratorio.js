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

function handle_database(req, res){

	pool.getConnection(function(err,connection){
		if (err) {
			connection.release();
			res.json({"code" : 100, "status" : "Error in connection database"});
			return;
		}   

		console.log('connected as id ' + connection.threadId);

		connection.query("select * from laboratorio_unidades",function(err,rows){
			connection.release();
			if(!err) {
				res.json(rows);
			}           
		});

		connection.on('error', function(err) {      
			res.json({"code" : 100, "status" : "Error in connection database"});
			return;     
		});
	});
}

function login(req, res){
	pool.getConnection(function(err,connection){
		if (err) {
			connection.release();
			res.json({"code" : 100, "status" : "Error in connection database"});
			return;
		} 

		var login = req.params.login;
		var senha = req.params.senha;

		console.log('connected as id ' + connection.threadId);

		connection.query("select * from laboratorio_unidades where login = ? and senha = ?", [login, senha],function(err,rows){
			connection.release();
			if(!err) {
				if(rows[0].login == login && rows[0].senha == senha){
					res.json(rows[0]);
					return;
				}
				res.json({"code":200, "status":"Usuário e senha não conferem"});
				return;
			}       
		});

		connection.on('error', function(err) {      
			res.json({"code" : 100, "status" : "Error in connection database"});
			return;     
		});

	});
};

function getLogin(req, res){
	pool.getConnection(function(err,connection){
		if (err) {
			connection.release();
			res.json({"code" : 100, "status" : "Error in connection database"});
			return;
		} 

		var login = req.params.login;
		var senha = req.params.senha;

		console.log('connected as id ' + connection.threadId);



	});
};


router.route('/')
	.get(function(req, res){
	handle_database(req, res);

})
	.post(function(req, res){
	if(req.method == 'POST'){
		console.log(req.body.login);
		console.log(!util.isUndefined(req.body.login));
		if(util.isUndefined(req.body.login)){

			console.log('Insira seu usuário.');
			return res.send({"result":"Insira seu usuário"});
		}
		else{

			console.log('tem login');
			if(!util.isUndefined(req.body.senha)){
				console.log('tem senha');
				login(req, res);
				return;
			}
			else{
				console.log('Insira sua senha.');
				return res.send({"result":"Insira sua senha"});
			}

		}
	}
});

// define the about route
router.get('/login/:login/:senha', function(req, res) {
	login(req, res);

});



module.exports = router;
