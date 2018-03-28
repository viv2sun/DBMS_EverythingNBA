var express = require('express');
var router = express.Router();

var fs = require("fs");
var content = fs.readFileSync("./fixtures/tasks.json");
var jsonContent = JSON.parse(content);

router.get('/tasks', function(req, res, next){
    console.log(req.body);
    console.log(jsonContent);
    //res.send('Task API');
    res.json(jsonContent);
});

router.get('/task/:id', function(req, res, next){
    for(var i = 0; i < jsonContent.length; i++){
        if(req.params.id == jsonContent[i].id){
            res.send(jsonContent[i]);
        }
    }
});




module.exports = router;