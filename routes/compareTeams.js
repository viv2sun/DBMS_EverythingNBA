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

router.get('/compareTeams:team1/:team2/:year', function(req, res, next){
    let conn;
    var team1 = req.params.team1;
    var team2 = req.params.team2;
    var year = req.params.year;

    compareTeams(team1, team2, year, res);
});

function compareTeams(team1, team2, year, res) {
    teams = {};

    oracledb.getConnection(config, function(err, connection){
        if (err) 
        { 
            console.log(err.message); 
            //res.send(err.message); 
        }
        else {
            console.log("Connection Established....");
                connection.execute(
                    "select t.team_id team_id, t.name team, ts.div_rank div_rank, ts.conf_rank conf_rank, ts.home_win home_win, ts.home_loss home_loss, \
                    ts.away_win away_win, ts.away_loss away_loss, ts.no_of_games games_played, ts.o_ast assists, ts.o_pts points,\
                    ts.o_blk blocks, ts.o_stl steals, ts.o_3pm threes, (ts.o_def_reb + ts.o_off_reb) as rebounds \
                from team_stats ts, team t\
                where t.team_id = ts.team\
                    and ts.team in (:team1, :team2)\
                    and ts.year = :year",
                [team1, team2, year], function(err, result){
                if(err){
                    console.log(err.message); 
                    //res.send(err.message); 
                }
                else{
                    result.rows.forEach(function(item) {
                        teams[item.TEAM_ID] = item;
                    });
                    
                    getHeadToHeadStats(teams, team1, team2, year, connection, res);
                }                
            });
        }
    });
}

function getHeadToHeadStats(teams, team1, team2, year, connection, res) {
    
    console.log('getting head to head stats');
    connection.execute(
        "select hth.team team, sum(hth.points) total_points, sum(hth.win) total_wins, sum(hth.win * hth.playoff) playoff_wins, count(*) games_played\
        from (select g.team_id team, g.points points, g.is_playoff playoff,\
                (case when g.result = 'L'\
                     then 0\
                     else 1\
                end) win\
            from game g\
            where g.team_id in (:team1, :team2)\
                and g.opp_team_id in (:team3, :team4)\
                and extract(year from g.game_date) = :year) hth\
        group by hth.team",
        [team1, team2, team1, team2, year], function(err, result){

            if(err) {
                console.log(err);
            }

            result.rows.forEach(function(item) {
                teams[item.TEAM].head_to_head = item;
            });
            
            getTeamSquad(teams, team1, team2, year, connection, res);
            //res.json(teamDetails);           
        });
}

function getTeamSquad(teams, team1, team2, year, connection, res) {
    console.log('getting the squad for the team');
    connection.execute(
        "select ps.team team, p.player_id player_id, p.LAST_NAME || ', ' || p.FIRST_NAME player_name\
        from player_stats ps,\
            player p\
        where ps.player = p.player_id\
            and ps.team in (:team1, :team2)\
            and ps.year = :year",
        [team1, team2, year], function(err, result){

            if(err) {
                console.log(err);
            }

            teams[team1].squad = [];
            teams[team2].squad = [];

            result.rows.forEach(function(item) {
                teams[item.TEAM].squad.push(item);
                console.log(teams[item.TEAM].squad[0]);
            });            
            
            console.log(teams);
            //res.json(teams); 

            connection.close(function(err){
                if(err){
                    console.log(err.message); 
                    res.send(err.message); 
                }
                console.log("Connection Closed....");
            });                      
        });
}

//compareTeams('BOS', 'LAL', 1984, null);
getTeams(null);
module.exports = router;