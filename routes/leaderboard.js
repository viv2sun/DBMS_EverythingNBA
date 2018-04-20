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

router.get('/leaderboard:tname/:fromYear/:toYear/:pos/:stats/:noOfRecords', function(req, res, next){
    console.log("Node JS: Leaderboard API" );
    console.log(req.body);
    console.log(req.params.tname);
    var teamName = req.params.tname;
    var fromYear = parseInt(req.params.fromYear, 10);
    var toYear = parseInt(req.params.toYear, 10);
    var pos =  req.params.pos;
    var stats =  req.params.stats;
    var noOfRecords =  req.params.noOfRecords;

    getLeaders(teamName, fromYear, toYear, pos, stats, noOfRecords, res);
});

function getLeaders(teamName, fromYear, toYear, pos, stats, noOfRecords, res) {
  
    oracledb.getConnection(config, function(err, connection){
        if (err) 
        { 
            console.log(err.message); 
            //res.send(err.message); 
        }
        else {
            console.log("Connection Established....");

            var teamClause = "";
            if(teamName != 'ALL') {
                teamClause = " and ps.team = " + teamName + " ";
            }

            var statsClause = "";

            switch(stats) {
                case 'AST':
                statsClause = 'assists';
                break;
                case 'PTS':
                statsClause = 'points';
                break;
                case 'BLK':
                statsClause = 'blocks';
                break;
                case 'STL':
                statsClause = 'steals';
                break;
                case 'REB':
                statsClause = 'rebounds';
                break;
                case 'THREES':
                statsClause = 'threes';
                break;
            }

            var posClause = '%'+pos+'%';

            var query = "select players.*, (p.last_name || ',' || p.first_name) pname\
            from (Select ps.Player pid, Sum(ps.Pts) points, Sum(ps.AST) assists, Sum(ps.STL) steals, Sum(ps.BLK) blocks,\
                            Sum(ps.GP) games_played, Sum(ps.minutes) minutes_played, Sum(ps.threepm) threes, Sum(ps.oreb + ps.dreb) rebounds\
                    from PLAYER_STATS ps\
                    where ps.year between :fromYear and :toYear " + teamClause +
                    "group by ps.Player\
                    order by " + statsClause + " desc) players,\
                    player p\
            where p.player_id = players.pid\
                and p.position like :posClause\
                and rownum <= :noOfRecords";
            
            connection.execute(query, [fromYear, toYear, posClause, noOfRecords], function(err, result){
                if (err) 
                { 
                    console.log(err.message); 
                    //res.send(err.message); 
                }
                console.log(result.rows);
                //res.send(result.rows);

                connection.close(function(err){
                    if(err){
                        console.log(err.message); 
                        //res.send(err.message); 
                    }
                    console.log("Connection Closed....");
                });   
            });

            
        }
    });
}

router.get('/leaderboard/getteams', function(req, res, next){
    console.log("Node JS: Team and Year dropdown API" );

    getTeams(res);    
});

function getTeams(res) {
    oracledb.getConnection(config, function(err, connection){
        if (err) 
        {
            //res.send(err.message); 
        }
        else {
            console.log("Connection Established....");
            teamAndYear = {};
            connection.execute(
            "select team_id, name from team\
            order by team_id", function(err, result){
                teamAndYear.teams = result.rows;
                getYear(teamAndYear, connection, res);   
            });
        }
    });
}

function getYear(teamAndYear, connection, res) {
        
    connection.execute(
        "select distinct year from team_stats\
        order by year", function(err, result){

            var yearArr = [];

            result.rows.forEach(function(item) {
                yearArr.push(item.YEAR);
            });

            teamAndYear.years = yearArr;

            console.log(teamAndYear);
            //res.json(teamAndYear);

            connection.close(function(err){
                if(err){
                    console.log(err.message); 
                    //res.send(err.message); 
                }
                console.log("Connection Closed....");
            });
            
        });
    }


//getLeaders('ALL', 1980, 1990, 'C', 'PTS', 10, null);
//getTeams(null);
module.exports = router;