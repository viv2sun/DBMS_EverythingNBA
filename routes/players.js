var express = require('express');
var oracledb = require('oracledb');
oracledb.outFormat = oracledb.OBJECT;

var router = express.Router();
const config = {
    user: 'vsangame',                // Update me
    password: 'Viv2sun10',        // Update me
    connectString: 'oracle.cise.ufl.edu:1521/orcl'   // Update me
};

var fs = require("fs");
var content = fs.readFileSync("./fixtures/players.json");
var jsonContent = JSON.parse(content);

router.get('/players', function(req, res, next){
    console.log(req.body);
    console.log(jsonContent);

    let conn;


    oracledb.getConnection(config, function(err, connection){
    if (err) 
    { 
        console.log(err.message); 
        res.send(err.message); 
    }
    else {
        console.log("Connection Established....");
            connection.execute(
            'select * from player where lower(last_name) LIKE \'%james%\'', function(err, result){
                console.log(result.rows);
                res.json(result.rows);
                console.log(connection);
                connection.close(function(err){
                    if(err){
                        console.log(err.message); 
                        res.send(err.message); 
                    }
                    console.log("Connection Closed....");
                });
            });
    }

    });
  
    //} 
    // catch (err) {
    //     console.log('Ouch!', err);
    // } finally {
    //     if (conn) { // conn assignment worked, need to close
    //         conn.close();
    //     }
    // }
    //res.send('Task API');
    console.log("Dude");
    //res.json(jsonContent);
});

router.get('/player/:id', function(req, res, next){
    for(var i = 0; i < jsonContent.length; i++){
        if(req.params.id == jsonContent[i].id){
            res.send(jsonContent[i]);
        }
    }
});

module.exports = router;