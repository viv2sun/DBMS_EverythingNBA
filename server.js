var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var tasks = require('./routes/tasks');
var players = require('./routes/players');
var cmpteams = require('./routes/cmpteams');
var teams = require('./routes/teams');
var lboard = require('./routes/leaderboard');
var statInsights = require('./routes/statinsights');

var port = 8001;

var app = express();

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// Set Static Folder
app.use(express.static(path.join(__dirname, 'client')));

// Body Parser MW
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', index);
app.use('/api', tasks);
app.use('/feature', players);
app.use('/teamcmp', cmpteams);
app.use('/teams', teams);
app.use('/leaderboard', lboard);
app.use('/insights', statInsights);


app.listen(port, function(){
    console.log('Server started on port '+port);
});