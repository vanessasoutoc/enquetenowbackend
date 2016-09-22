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

function allExames(req, res){
	pool.getConnection(function(err,connection){
    if (err) {
      connection.release();
      res.json({"code" : 100, "status" : "Error in connection database"});
      return;
    } 

    var id_laboratorio_unidade = req.param('id_laboratorio_unidade');
    console.log(id_laboratorio_unidade);

    console.log('connected as id ' + connection.threadId);

    connection.query("select e.* from laboratorio_unidade_exame as lue, exame as e WHERE id_laboratorio_unidade = ? AND e.id_exame = lue.id_exame",[id_laboratorio_unidade],function(err,rows){
      connection.release();
      if(!err) {
        if(rows.length > 0){
        	console.log(rows.length)
          res.json(rows);
          return;
        }
        res.json({"code":200, "status":"Erro ao buscar exames"});
        return;
      }       
    });

    connection.on('error', function(err) {      
      res.json({"code" : 100, "status" : "Error in connection database"});
      return;     
    });

  });

}

router.get('/', function(req, res) {

  allExames(req, res);

});


module.exports = router;