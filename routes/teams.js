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

router.get('/team/view:tname/:tyear', function(req, res, next){
    console.log("Node JS: Seach Team API" );
    console.log(req.body);
    console.log(req.params.tname);
    var teamName = req.params.tname;
    var teamYear = parseInt(req.params.tyear, 10);

    var teamDetails = {};

    getTeamDetails(teamDetails, teamName, teamYear, res);
});


router.get('/team/getteams', function(req, res, next){
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

function getTeamDetails(teamDetails, teamName, teamYear, res) {
    oracledb.getConnection(config, function(err, connection){
        if (err) 
        { 
            console.log(err.message); 
            res.send(err.message); 
        }
        else {
            console.log("Connection Established....");

            teamDetails.stats = {};
            connection.execute(
            "select t.name team, ts.div_rank div_rank, ts.conf_rank conf_rank, ts.home_win home_win,\
                ts.home_loss home_loss, ts.away_win away_win, ts.away_loss away_loss, ts.no_of_games games_played,\
                ts.o_ast assists, ts.o_pts points, ts.o_blk blocks, ts.o_stl steals, ts.o_3pm threes,\
                (ts.o_def_reb + ts.o_off_reb) as rebounds\
            from team_stats ts,\
                    team t\
            where ts.team = t.team_id\
                and ts.team = :teamName \
                and ts.year = :teamYear",
            [teamName, teamYear], function(err, result){
                teamDetails.stats = result.rows[0];
                getTeamSquad(teamDetails, teamName, teamYear, connection, res);   
            });
        }
    });
}

function getTeamSquad(teamDetails, teamName, teamYear, connection, res) {

    teamDetails.squad = [];
    
    connection.execute(
        "select p.LAST_NAME || ', ' || p.FIRST_NAME player_name, p.position position, ps.pts points, ps.ast assists, ps.blk blocks,\
            ps.GP games_played, ps.threepm threes, ps.reb rebounds, ps.minutes minutes_played\
        from player_stats ps,\
            player p\
        where ps.player = p.player_id\
            and ps.team = :teamName\
            and ps.year = :teamYear",
        [teamName, teamYear], function(err, result){

            teamDetails.squad = result.rows;
            
            res.json(teamDetails);

            connection.close(function(err){
                if(err){
                    console.log(err.message); 
                    res.send(err.message); 
                }
                console.log("Connection Closed....");
            });
            
        });
}

//getTeamDetails({}, 'BOS', 2000, null);
getTeams(null);
module.exports = router;