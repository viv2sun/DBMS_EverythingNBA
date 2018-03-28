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
});

router.get('/player/search/:pname', function(req, res, next){
    console.log("Node JS: Seach Player API" );
    console.log(req.body);
    console.log(req.params.pname);
    var playerName = '%' + req.params.pname + '%';
    oracledb.getConnection(config, function(err, connection){
        if (err) 
        { 
            console.log(err.message); 
            res.send(err.message); 
        }
        else {
            console.log("Connection Established....");
                connection.execute(
                "select p.player_id, p.last_name, p.first_name from player p where lower(p.last_name) like :firstName or lower(p.first_name) like :lastName order by p.first_name",
                [playerName, playerName], function(err, result){
                    console.log(result.rows);
                    res.json(result.rows);
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
});

router.get('/player/:pid', function(req, res, next){
    console.log("Node JS: Player Profile API" );
    console.log(req.body);
    console.log(req.params.pid);
    var pid = req.params.pid;
    oracledb.getConnection(config, function(err, connection){
        if (err) 
        { 
            console.log(err.message); 
            res.send(err.message); 
        }
        else {
            console.log("Connection Established....");
                connection.execute(
                "select pp.*, p.*, pt.team, tmates.team_mates\
                from Player p,\
                    (Select ps.Player pid, Sum(ps.Pts) tpts, Sum(ps.AST) tast, Sum(ps.STL) tstl, Sum(ps.BLK) tblk,\
                                Sum(ps.trno) tto, Sum(ps.PF) tpf, Sum(ps.GP) tgp, Sum(ps.GS) tgs, Sum(ps.fgm) tfgm, \
                                Sum(ps.fga) tfga, Sum(ps.ftm) tftm, Sum(ps.fta) tfta, Sum(ps.threepm) threepm, Sum(ps.threepa) threepa,\
                                Sum(ps.oreb) toreb, Sum(ps.dreb) tdreb, Sum(ps.minutes) tmin\
                        from PLAYER_STATS ps\
                        where ps.player = :pid1\
                        group by ps.Player) pp,\
                    (select career.player pid, wm_concat(career.team || ' ' || career.year) team \
                    from (select minp.player player, t.name team, minp.minyear || '-' || maxp.maxyear as year\
                            from (Select  ps.player player, ps.team team, min(ps.year) minyear\
                                    from Player_stats ps \
                                    where ps.player = :pid2\
                                    group by ps.player, ps.team) minp,\
                                (Select  ps.player player, ps.team team, max(ps.year) maxyear\
                                    from Player_stats ps \
                                    where ps.player = :pid3\
                                    group by ps.player, ps.team) maxp,\
                                team t\
                            where maxp.player = minp.player\
                                and t.team_id = minp.team\
                                and maxp.team = minp.team) career\
                    group by career.player) pt,\
                    (select tms.pid pid, wm_concat(tms.team_mates) team_mates\
                    from (select distinct pl.pid pid, pl.player team_mates\
                        from (select op.pid pid, p.LAST_NAME || '-' || p.FIRST_NAME player, sum(ps.pts) pts\
                            from (select distinct p2.player player, p1.player pid\
                                from player_stats p1, player_stats p2\
                                where p1.player = :pid4\
                                    and p1.player <> p2.player\
                                    and p1.team = p2.team\
                                    and p1.year = p2.year) op,\
                                    player_stats ps,\
                                    player p\
                            where p.player_id = op.player\
                                and op.player = ps.player\
                            group by ps.player, op.pid, p.last_name, p.first_name\
                            order by pts desc) pl\
                        where rownum <= 3) tms\
                    group by tms.pid) tmates\
                where p.player_id = pp.pid\
                    and pp.pid = pt.pid\
                    and tmates.pid = pp.pid",
                [pid, pid, pid, pid], function(err, result){
                    if(err){
                        console.log(err);
                        console.log(err.message);
                    }
                    else{
                        console.log(result.rows);
                        res.json(result.rows);
                    }
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
});

module.exports = router;