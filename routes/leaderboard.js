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

router.get('/view:tname/:fromYear/:toYear/:pos/:stats/:noOfRecords/:isRookie/:isCalendarYear', function(req, res, next){
    console.log("Node JS: Leaderboard API" );
    console.log(req.body);
    console.log(req.params.tname);
    var teamName = req.params.tname;
    var fromYear = parseInt(req.params.fromYear, 10);
    var toYear = parseInt(req.params.toYear, 10);
    var pos =  req.params.pos;
    var stats =  req.params.stats;
    var noOfRecords =  req.params.noOfRecords;
    var isRookie =  req.params.isRookie;
    
    if(isRookie == "true") {
        console.log("Inside Rookie");
        getRookies(teamName, fromYear, pos, stats, noOfRecords, res);
    }
    else {
        if(isCalendarYear == "true") {
            console.log("Inside Calendar Year Players");
            getCalendarYear(teamName, fromYear, toYear, pos, stats, noOfRecords, res)
        }
        else {
            getLeaders(teamName, fromYear, toYear, pos, stats, noOfRecords, res);
        }
    }
});

function getCalendarYear(teamName, fromYear, toYear, pos, stats, noOfRecords, res) {
  
    oracledb.getConnection(config, function(err, connection){
        if (err) 
        { 
            console.log(err.message); 
            //res.send(err.message); 
        }
        else {
            console.log("Connection Established....");

            var teamClause = "";
            if(teamName != 'ALL' && teamName != 'undefined') {
                teamClause = " and ps.team = '" + teamName + "' ";
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

            var posClause = "";
            if(pos != 'ALL') {
                posClause = " and p.position like '%" + pos + "%' ";
            }

            var query = "select (p.last_name || ',' || p.first_name || ' - ' || players.year ) pname, players.points, players.assists,\
                                    players.steals, players.blocks, players.threes, players.rebounds, players.games_played, players.minutes_played\
                        from (Select ps.Player pid, ps.year year, ps.Pts points,ps.AST assists, ps.STL steals, ps.BLK blocks,\
                                    ps.GP games_played, ps.minutes minutes_played, ps.threepm threes, ps.oreb + ps.dreb rebounds\
                            from PLAYER_STATS ps\
                            where ps.year between :fromYear and :toYear " + teamClause + 
                            "order by "  +  statsClause +" desc) players,\
                            player p\
                        where p.player_id = players.pid " + posClause 
                        + "and rownum <= :noOfRecords";

                console.log(query);
            
            connection.execute(query, [fromYear, toYear, noOfRecords], function(err, result){
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

function getRookies(teamName, year, pos, stats, noOfRecords, res) {
  
    console.log(teamName);
    console.log(year);
    console.log(pos);
    console.log(stats);
    console.log(noOfRecords);

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
                teamClause = " and pstats.team = '" + teamName + "' ";
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

            var posClause = "";
            if(pos != 'ALL') {
                posClause = " and p.position like '%" + pos + "%' ";
            }

            var rowNumClause = " and rownum <= " + noOfRecords;

            var query = "select (p.last_name || ',' || p.first_name) pname, players.points, players.assists,\
            players.steals, players.blocks, players.threes, players.rebounds, players.games_played, players.minutes_played\
            from   (select  pstats.Player pid, pstats.Pts points, (pstats.AST) assists, (pstats.STL) steals, (pstats.BLK) blocks,\
                            (pstats.GP) games_played, (pstats.minutes) minutes_played,\
                             (pstats.threepm) threes, (pstats.oreb + pstats.dreb) rebounds\
                    from player_stats pstats,\
                        (select ps.player rookie_id, min(year) rookie_year\
                            from player_stats ps\
                            group by ps.player) rookie\
                    where pstats.player = rookie.rookie_id\
                        and pstats.year = rookie.rookie_year "  + teamClause +
                        "and pstats.year = :year\
                        order by " + statsClause + " desc) players,\
                    player p\
            where p.player_id = players.pid " + posClause + rowNumClause;

            console.log(query);
            
            connection.execute(query, [year], function(err, result){
                if (err) 
                { 
                    console.log(err.message); 
                    //res.send(err.message); 
                }
                console.log(result.rows);
                res.send(result.rows);

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
                teamClause = " and ps.team = '" + teamName + "' ";
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

            var posClause = "";
            if(pos != 'ALL') {
                posClause = " and p.position like '%" + pos + "%' ";
            }

            var query = "select (p.last_name || ',' || p.first_name) pname, players.points, players.assists,\
            players.steals, players.blocks, players.threes, players.rebounds, players.games_played, players.minutes_played\
            from (Select ps.Player pid, Sum(ps.Pts) points, Sum(ps.AST) assists, Sum(ps.STL) steals, Sum(ps.BLK) blocks,\
                            Sum(ps.GP) games_played, Sum(ps.minutes) minutes_played, Sum(ps.threepm) threes, Sum(ps.oreb + ps.dreb) rebounds\
                    from PLAYER_STATS ps\
                    where ps.year between :fromYear and :toYear " + teamClause +
                    "group by ps.Player\
                    order by " + statsClause + " desc) players,\
                    player p\
            where p.player_id = players.pid" + posClause +
                "and rownum <= :noOfRecords";

                console.log(query);
            
            connection.execute(query, [fromYear, toYear, noOfRecords], function(err, result){
                if (err) 
                { 
                    console.log(err.message); 
                    //res.send(err.message); 
                }
                console.log(result.rows);
                res.send(result.rows);

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

router.get('/getteams', function(req, res, next){
    console.log("Node JS: Team and Year dropdown API - Leaderboard" );

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
            "select ts.team team_id, (t.name || ' (' || min(ts.year) || '-' || max(ts.year) || ')') name\
                from team_stats ts, team t \
                where t.team_id = ts.team \
                group by ts.team, t.name \
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
            res.json(teamAndYear);

            connection.close(function(err){
                if(err){
                    console.log(err.message); 
                    //res.send(err.message); 
                }
                console.log("Connection Closed....");
            });
            
        });
    }

//getRookies('ALL', 1993, 'G', 'AST', 20, null);
//getLeaders('ALL', 1980, 1990, 'C', 'PTS', 10, null);
//getCalendarYear('CLE', 2000, 2010, 'ALL', 'PTS', 10, null);
//getTeams(null);
module.exports = router;