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

router.get('/searchPlayer:pname', function(req, res, next){
    let conn;
    var playerName = '%' + req.params.pname + '%';

    searchPlayers(playerName, res);
});

router.get('/comparePlayers:pid1/:pid2', function(req, res, next){
    let conn;
    var player1 = req.params.pid1;
    var player2 = req.params.pid2;

    comparePlayers(player1, player2, res);
});

function comparePlayers(player1, player2, res) {
    players = {};

    oracledb.getConnection(config, function(err, connection){
        if (err) 
        { 
            console.log(err.message); 
            //res.send(err.message); 
        }
        else {
            console.log("Connection Established....");
                connection.execute(
                    "Select ps.Player pid, Sum(ps.Pts) tpts, Sum(ps.AST) tast, Sum(ps.STL) tstl, Sum(ps.BLK) tblk,\
                        Sum(ps.trno) tto, Sum(ps.PF) tpf, Sum(ps.GP) tgp, Sum(ps.GS) tgs, Sum(ps.fgm) tfgm, \
                        Sum(ps.fga) tfga, Sum(ps.ftm) tftm, Sum(ps.fta) tfta, Sum(ps.threepm) threepm, Sum(ps.threepa) threepa,\
                        Sum(ps.oreb) toreb, Sum(ps.dreb) tdreb, Sum(ps.minutes) tmin\
                    from PLAYER_STATS ps\
                    where ps.player in (:player1, :player2)\
                    group by ps.Player",
                [player1, player2], function(err, result){
                if(err){
                    console.log(err.message); 
                    //res.send(err.message); 
                }
                else{
                    result.rows.forEach(function(item) {
                        players[item.PID] = item;
                    });
                    
                    getFamousTeamMates(players, player1, player2, connection, res);
                }                
            });
        }
    });
}

function getFamousTeamMates(players, player1, player2, connection, res) {
    
    console.log('getting famous team mates');
    connection.execute(
        "select distinct pl.pid pid, pl.player team_mates\
            from (select op.pid pid, p.LAST_NAME || ', ' || p.FIRST_NAME player, sum(ps.pts) pts\
                    from (select distinct p2.player player, p1.player pid\
                        from player_stats p1, player_stats p2\
                        where p1.player = :player1\
                            and p1.player <> p2.player\
                            and p1.team = p2.team\
                            and p1.year = p2.year) op,\
                            player_stats ps,\
                            player p\
                    where p.player_id = op.player\
                        and op.player = ps.player\
                    group by ps.player, op.pid, p.last_name, p.first_name\
                    order by pts desc) pl\
            where rownum <= 3\
            UNION ALL\
            select distinct pl.pid pid, pl.player team_mates\
                    from (select op.pid pid, p.LAST_NAME || ', ' || p.FIRST_NAME player, sum(ps.pts) pts\
                        from (select distinct p2.player player, p1.player pid\
                            from player_stats p1, player_stats p2\
                            where p1.player = :player2\
                                and p1.player <> p2.player\
                                and p1.team = p2.team\
                                and p1.year = p2.year) op,\
                                player_stats ps,\
                                player p\
                        where p.player_id = op.player\
                            and op.player = ps.player\
                        group by ps.player, op.pid, p.last_name, p.first_name\
                        order by pts desc) pl\
            where rownum <= 3",
        [player1, player2], function(err, result){

            if(err) {
                console.log(err);
            }

            players[player1].teamMates = [];
            players[player2].teamMates = [];

            result.rows.forEach(function(item) {
                players[item.PID].teamMates.push(item.TEAM_MATES);
            });
            
            getPeakYears(players, player1, player2, connection, res);        
        });
}

function getPeakYears(players, player1, player2, connection, res) {
    console.log('getting peak years');
    connection.execute(
        "select py.player pid, py.year peak_years\
            from (select ps.year year, ps.player player\
                from player_stats ps\
                where player = :player1\
                order by ps.pts desc) py\
            where rownum <= 3\
            union all\
            select py.player, py.year peak_years\
            from (select ps.year year, ps.player player\
                from player_stats ps\
                where player = :player2\
                order by ps.pts desc) py\
            where rownum <= 3\
            order by peak_years",
        [player1, player2], function(err, result){

            if(err) {
                console.log(err);
            }

            players[player1].peakYears = [];
            players[player2].peakYears = [];

            result.rows.forEach(function(item) {
                players[item.PID].peakYears.push(item.PEAK_YEARS);
            });
            
            getConferenceTitles(players, player1, player2, connection, res);
            //res.json(teamDetails);           
        });
}


function getConferenceTitles(players, player1, player2, connection, res) {
    console.log('getting No. of conference titles');
    connection.execute(
        "select ps.player pid, count(*) count\
        from team_stats ts,\
            player_stats ps\
        where ts.team = ps.team\
            and ts.year = ps.year\
            and ps.player in (:player1, :player2)\
            and ts.conf_rank = 1\
        group by ps.player",
        [player1, player2], function(err, result){

            if(err) {
                console.log(err);
            }

            result.rows.forEach(function(item) {
                players[item.PID].CONF_TITLE_COUNT = item.COUNT;
            });
            
            getTeamsPlayedFor(players, player1, player2, connection, res);
            //res.json(teamDetails);           
        });
}

function getTeamsPlayedFor(players, player1, player2, connection, res) {
    console.log('getting teams played for');
    connection.execute(
        "select career.player pid, wm_concat(career.team || ' ' || career.year) team\
        from (select minp.player player, t.name team, minp.minyear || '-' || maxp.maxyear as year\
                from (Select  ps.player player, ps.team team, min(ps.year) minyear\
                        from Player_stats ps\
                        where ps.player in (:player1, :player2)\
                        group by ps.player, ps.team) minp,\
                    (Select  ps.player player, ps.team team, max(ps.year) maxyear\
                        from Player_stats ps \
                        where ps.player in (:player1, :player2)\
                        group by ps.player, ps.team) maxp,\
                    team t\
                where maxp.player = minp.player\
                    and t.team_id = minp.team\
                    and maxp.team = minp.team) career\
        group by career.player",
        [player1, player2], function(err, result){

            if(err) {
                console.log(err);
            }

            result.rows.forEach(function(item) {
                players[item.PID].TEAMS_PLAYED = item.TEAM;
            });
            
            console.log(players);

            connection.close(function(err){
                if(err){
                    console.log(err.message); 
                    //res.send(err.message); 
                }
                console.log("Connection Closed....");
            });
            //res.json(teamDetails);           
        });
}

function searchPlayers(playerName, res) {
    oracledb.getConnection(config, function(err, connection){
        if (err) 
        { 
            console.log(err.message); 
            //res.send(err.message); 
        }
        else {
            console.log("Connection Established....");
                connection.execute(
                    "select p.player_id, p.last_name, p.first_name from player p where lower(p.last_name) like :firstName or lower(p.first_name) like :lastName order by p.first_name",
                    [playerName, playerName], function(err, result){
                        console.log(result.rows);
                        //res.json(result.rows);
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


//searchPlayers('lebron');
comparePlayers('jamesle01', 'abdulka01', null);
module.exports = router;