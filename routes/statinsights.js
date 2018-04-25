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

router.get('/getinsights:tname/:fromYear/:toYear/:pos/:attributes', function(req, res, next){
    console.log("Node JS: stat insights API" );
    console.log(req.body);
    console.log(req.params);
    console.log(req.params.tname);
    var teamName = req.params.tname;
    var fromYear = req.params.fromYear;
    var toYear = req.params.toYear;
    var pos =  req.params.pos;
    var attributeStr = req.params.attributes;
    var attributeJson = JSON.parse(attributeStr);

    console.log(attributeJson);

    getStats(teamName, fromYear, toYear, pos, attributeJson, res);

});

function getStats(teamName, fromYear, toYear, pos, attributeJson, res) {
  
    oracledb.getConnection(config, function(err, connection){
        if (err) 
        { 
            console.log(err.message); 
            res.send(err.message); 
        }
        else {
            console.log("Connection Established....");

            var teamClause = "";
            if(teamName != 'ALL' && teamName != 'undefined') {
                teamClause = " and stats.team = '" + teamName + "' ";
            }

            var attributeClause = "";

            if(attributeJson.assists != null && attributeJson.assists.set == true) {
                attributeClause += " and ps.ast between " + attributeJson.assists.min + " and " + attributeJson.assists.max;
            }

            if(attributeJson.steals != null && attributeJson.steals.set == true) {
                attributeClause += " and ps.stl between " + attributeJson.steals.min + " and " + attributeJson.steals.max;
            }

            if(attributeJson.points != null && attributeJson.points.set == true) {
                attributeClause += " and ps.pts between " + attributeJson.points.min + " and " + attributeJson.points.max;
            }

            if(attributeJson.blocks != null && attributeJson.blocks.set == true) {
                attributeClause += " and ps.blk between " + attributeJson.blocks.min + " and " + attributeJson.blocks.max;
            }
            
            if(attributeJson.rebounds != null && attributeJson.rebounds.set == true) {
                attributeClause += " and ps.reb between " + attributeJson.rebounds.min + " and " + attributeJson.rebounds.max;
            }

            if(attributeJson.threes != null && attributeJson.threes.set == true) {
                attributeClause += " and ps.thr between " + attributeJson.threes.min + " and " + attributeJson.threes.max;
            }

            var heightClause = "";

            if(attributeJson.height != null && attributeJson.height.set == true) {
                heightClause += " and p.height between " + attributeJson.height.min + " and " + attributeJson.height.max;
            }

            var weightClause = "";

            if(attributeJson.weight != null && attributeJson.weight.set == true) {
                weightClause += " and p.weight between " + attributeJson.weight.min + " and " + attributeJson.weight.max;
            }

            var yearClause = "";

            if(fromYear != 'undefined' && toYear != 'undefined') {
                yearClause += " and stats.year between " + fromYear + " and " + toYear;
            }


            var posClause = "";
            if(pos != 'undefined') {
                posClause = " and p.position like '%" + pos + "%' ";
            }

            var whereClause = {};

            whereClause.team = teamClause;
            whereClause.attribute = attributeClause;
            whereClause.year = yearClause;
            whereClause.pos = posClause;
            whereClause.height = heightClause;
            whereClause.weight = weightClause;

            var query = "select count(pid) count, min(pts) pts_min, max(pts) pts_max, avg(pts) pts_avg,\
                            min(ast) ast_min, max(ast) ast_max, avg(ast) ast_avg,\
                            min(stl) stl_min, max(stl) stl_max, avg(stl) stl_avg,\
                            min(blk) blk_min, max(blk) blk_max, avg(blk) blk_avg,\
                            min(thr) thr_min, max(thr) thr_max, avg(thr) thr_avg,\
                            min(reb) reb_min, max(reb) reb_max, avg(reb) reb_avg,\
                            min(ftm) ftm_min, max(ftm) ftm_max, avg(ftm) ftm_avg,\
                            min(height) h_min, max(height) h_max, CAST(avg(height) as INT) h_avg,\
                            min(weight) w_min, max(weight) w_max, CAST(avg(weight) as INT) w_avg\
                        from (select stats.player pid, sum(stats.pts) pts,\
                                sum(stats.ast) ast, sum(stats.stl) stl, sum(stats.blk) blk, sum(stats.threepm) thr,\
                                sum(stats.reb) reb, sum(stats.ftm) ftm\
                            from player_stats stats,\
                                player p\
                            where stats.player = p.player_id " 
                            + yearClause
                            + teamClause
                            + heightClause
                            + weightClause
                            + "group by stats.player) ps,\
                            player p\
                        where p.player_id = ps.pid" 
                        + attributeClause;
            
            connection.execute(query, function(err, result){
                if (err) 
                { 
                    console.log(err.message); 
                    //res.send(err.message); 
                }

                stats = {};

                stats.assists = {};
                stats.assists.min = result.rows[0].AST_MIN;
                stats.assists.max = result.rows[0].AST_MAX;
                stats.assists.avg = parseInt(result.rows[0].AST_AVG, 10);

                stats.blocks = {};
                stats.blocks.min = result.rows[0].BLK_MIN;
                stats.blocks.max = result.rows[0].BLK_MAX;
                stats.blocks.avg = parseInt(result.rows[0].BLK_AVG, 10);

                stats.steals = {};
                stats.steals.min = result.rows[0].STL_MIN;
                stats.steals.max = result.rows[0].STL_MAX;
                stats.steals.avg = parseInt(result.rows[0].STL_AVG, 10);

                stats.points = {};
                stats.points.min = result.rows[0].PTS_MIN;
                stats.points.max = result.rows[0].PTS_MAX;
                stats.points.avg = parseInt(result.rows[0].PTS_AVG, 10);

                stats.rebounds = {};
                stats.rebounds.min = result.rows[0].REB_MIN;
                stats.rebounds.max = result.rows[0].REB_MAX;
                stats.rebounds.avg = parseInt(result.rows[0].REB_AVG, 10);

                stats.threes = {};
                stats.threes.min = result.rows[0].THR_MIN;
                stats.threes.max = result.rows[0].THR_MAX;
                stats.threes.avg = parseInt(result.rows[0].THR_AVG, 10);

                stats.freethrows = {};
                stats.freethrows.min = result.rows[0].FTM_MIN;
                stats.freethrows.max = result.rows[0].FTM_MAX;
                stats.freethrows.avg = parseInt(result.rows[0].FTM_AVG, 10);

                stats.height = {};
                stats.height.min = result.rows[0].H_MIN;
                stats.height.max = result.rows[0].H_MAX;
                stats.height.avg = parseInt(result.rows[0].H_AVG, 10);

                stats.weight = {};
                stats.weight.min = result.rows[0].W_MIN;
                stats.weight.max = result.rows[0].W_MAX;
                stats.weight.avg = parseInt(result.rows[0].W_AVG, 10);

                stats.count = result.rows[0].COUNT;

                console.log(stats);
                
                getPlayersForPoints(connection, teamName, fromYear, toYear, pos, attributeJson, stats, whereClause, res);
            });

            
        }
    });
}

function getPlayersForPoints(connection, teamName, fromYear, toYear, pos, attributeJson, stats, whereClause, res) {
    console.log("Connection Established....");
    var min_pts = stats.points.min;
    var max_pts = stats.points.max;

    var query = "select min_player, max_player from \
            (select (p.last_name || ', ' || p.first_name) min_player\
            from (select stats.player pid, sum(stats.pts) pts,\
                    sum(stats.ast) ast, sum(stats.stl) stl, sum(stats.blk) blk, sum(stats.threepm) thr,\
                    sum(stats.reb) reb, sum(stats.ftm) ftm\
                from player_stats stats,\
                    player p\
                where stats.player = p.player_id " 
                + whereClause.year
                + whereClause.team
                + whereClause.height
                + whereClause.weight
                + "group by stats.player) ps,\
                player p\
            where p.player_id = ps.pid\
            and ps.pts = :min_pts"
            + whereClause.attribute + ") t1, \n"
            + "(select (p.last_name || ', ' || p.first_name) max_player\
            from (select stats.player pid, sum(stats.pts) pts,\
                    sum(stats.ast) ast, sum(stats.stl) stl, sum(stats.blk) blk, sum(stats.threepm) thr,\
                    sum(stats.reb) reb, sum(stats.ftm) ftm\
                from player_stats stats,\
                    player p\
                where stats.player = p.player_id "
                + whereClause.year
                + whereClause.team
                + whereClause.height
                + whereClause.weight
                + "group by stats.player) ps,\
                player p\
            where p.player_id = ps.pid\
            and ps.pts = :max_pts"
            + whereClause.attribute + ") t2";

    
    
    connection.execute(query, 
        [min_pts, max_pts], function(err, result){
        if (err) 
        { 
            console.log(err.message); 
            //res.send(err.message); 
        }

        console.log(result);
        stats.points.min_player = result.rows[0].MIN_PLAYER;
        stats.points.max_player = result.rows[0].MAX_PLAYER;

        getPlayersForAssists(connection, teamName, fromYear, toYear, pos, attributeJson, stats, whereClause, res);

    });
}


function getPlayersForAssists(connection, teamName, fromYear, toYear, pos, attributeJson, stats, whereClause, res) {
  
    console.log("Connection Established....");
    var min_ast = stats.assists.min;
    var max_ast = stats.assists.max;

    var query = "select min_player, max_player from \
                (select (p.last_name || ', ' || p.first_name) min_player\
                from (select stats.player pid, sum(stats.pts) pts,\
                        sum(stats.ast) ast, sum(stats.stl) stl, sum(stats.blk) blk, sum(stats.threepm) thr,\
                        sum(stats.reb) reb, sum(stats.ftm) ftm\
                    from player_stats stats,\
                        player p\
                    where stats.player = p.player_id " 
                    + whereClause.year
                    + whereClause.team
                    + whereClause.height
                    + whereClause.weight
                    + "group by stats.player) ps,\
                    player p\
                where p.player_id = ps.pid\
                and ps.ast = :min_ast"
                + whereClause.attribute + ") t1, \n"
                + "(select (p.last_name || ', ' || p.first_name) max_player\
                from (select stats.player pid, sum(stats.pts) pts,\
                        sum(stats.ast) ast, sum(stats.stl) stl, sum(stats.blk) blk, sum(stats.threepm) thr,\
                        sum(stats.reb) reb, sum(stats.ftm) ftm\
                    from player_stats stats,\
                        player p\
                    where stats.player = p.player_id "
                    + whereClause.year
                    + whereClause.team
                    + whereClause.height
                    + whereClause.weight
                    + "group by stats.player) ps,\
                    player p\
                where p.player_id = ps.pid\
                and ps.ast = :max_ast"
                + whereClause.attribute + ") t2";

    
    
    connection.execute(query, 
        [min_ast, max_ast], function(err, result){
        if (err) 
        { 
            console.log(err.message); 
            //res.send(err.message); 
        }

        stats.assists.min_player = result.rows[0].MIN_PLAYER;
        stats.assists.max_player = result.rows[0].MAX_PLAYER

        getPlayersForRebounds(connection, teamName, fromYear, toYear, pos, attributeJson, stats, whereClause, res);
    });
}

function getPlayersForRebounds(connection, teamName, fromYear, toYear, pos, attributeJson, stats, whereClause, res) {
  
    console.log("Connection Established....");
    var min_reb = stats.rebounds.min;
    var max_reb = stats.rebounds.max;

    var query = "select min_player, max_player from \
                (select (p.last_name || ', ' || p.first_name) min_player\
                from (select stats.player pid, sum(stats.pts) pts,\
                        sum(stats.ast) ast, sum(stats.stl) stl, sum(stats.blk) blk, sum(stats.threepm) thr,\
                        sum(stats.reb) reb, sum(stats.ftm) ftm\
                    from player_stats stats,\
                        player p\
                    where stats.player = p.player_id " 
                    + whereClause.year
                    + whereClause.team
                    + whereClause.height
                    + whereClause.weight
                    + "group by stats.player) ps,\
                    player p\
                where p.player_id = ps.pid\
                and ps.reb = :min_reb"
                + whereClause.attribute + ") t1, \n"
                + "(select (p.last_name || ', ' || p.first_name) max_player\
                from (select stats.player pid, sum(stats.pts) pts,\
                        sum(stats.ast) ast, sum(stats.stl) stl, sum(stats.blk) blk, sum(stats.threepm) thr,\
                        sum(stats.reb) reb, sum(stats.ftm) ftm\
                    from player_stats stats,\
                        player p\
                    where stats.player = p.player_id "
                    + whereClause.year
                    + whereClause.team
                    + whereClause.height
                    + whereClause.weight
                    + "group by stats.player) ps,\
                    player p\
                where p.player_id = ps.pid\
                and ps.reb = :max_reb"
                + whereClause.attribute + ") t2";

    
    
    connection.execute(query, 
        [min_reb, max_reb], function(err, result){
        if (err) 
        { 
            console.log(err.message); 
            //res.send(err.message); 
        }

        console.log(result);
        stats.rebounds.min_player = result.rows[0].MIN_PLAYER;
        stats.rebounds.max_player = result.rows[0].MAX_PLAYER

        getPlayersForSteals(connection, teamName, fromYear, toYear, pos, attributeJson, stats, whereClause, res);
    });            
}

function getPlayersForSteals(connection, teamName, fromYear, toYear, pos, attributeJson, stats, whereClause, res) {
  
    console.log("Connection Established....");
    var min_stl = stats.steals.min;
    var max_stl = stats.steals.max;

    var query = "select min_player, max_player from \
                (select (p.last_name || ', ' || p.first_name) min_player\
                from (select stats.player pid, sum(stats.pts) pts,\
                        sum(stats.ast) ast, sum(stats.stl) stl, sum(stats.blk) blk, sum(stats.threepm) thr,\
                        sum(stats.reb) reb, sum(stats.ftm) ftm\
                    from player_stats stats,\
                        player p\
                    where stats.player = p.player_id " 
                    + whereClause.year
                    + whereClause.team
                    + whereClause.height
                    + whereClause.weight
                    + "group by stats.player) ps,\
                    player p\
                where p.player_id = ps.pid\
                and ps.stl = :min_stl"
                + whereClause.attribute + ") t1, \n"
                + "(select (p.last_name || ', ' || p.first_name) max_player\
                from (select stats.player pid, sum(stats.pts) pts,\
                        sum(stats.ast) ast, sum(stats.stl) stl, sum(stats.blk) blk, sum(stats.threepm) thr,\
                        sum(stats.reb) reb, sum(stats.ftm) ftm\
                    from player_stats stats,\
                        player p\
                    where stats.player = p.player_id "
                    + whereClause.year
                    + whereClause.team
                    + whereClause.height
                    + whereClause.weight
                    + "group by stats.player) ps,\
                    player p\
                where p.player_id = ps.pid\
                and ps.stl = :max_stl"
                + whereClause.attribute + ") t2";

    
    
    connection.execute(query, 
        [min_stl, max_stl], function(err, result){
        if (err) 
        { 
            console.log(err.message); 
            //res.send(err.message); 
        }

        console.log(result);
        stats.steals.min_player = result.rows[0].MIN_PLAYER;
        stats.steals.max_player = result.rows[0].MAX_PLAYER

        getPlayersForBlocks(connection, teamName, fromYear, toYear, pos, attributeJson, stats, whereClause, res);
    });            
}

function getPlayersForBlocks(connection, teamName, fromYear, toYear, pos, attributeJson, stats, whereClause, res) {
  
    console.log("Connection Established....");
    var min_blk = stats.blocks.min;
    var max_blk = stats.blocks.max;

    var query = "select min_player, max_player from \
                (select (p.last_name || ', ' || p.first_name) min_player\
                from (select stats.player pid, sum(stats.pts) pts,\
                        sum(stats.ast) ast, sum(stats.stl) stl, sum(stats.blk) blk, sum(stats.threepm) thr,\
                        sum(stats.reb) reb, sum(stats.ftm) ftm\
                    from player_stats stats,\
                        player p\
                    where stats.player = p.player_id " 
                    + whereClause.year
                    + whereClause.team
                    + whereClause.height
                    + whereClause.weight
                    + "group by stats.player) ps,\
                    player p\
                where p.player_id = ps.pid\
                and ps.blk = :min_blk"
                + whereClause.attribute + ") t1, \n"
                + "(select (p.last_name || ', ' || p.first_name) max_player\
                from (select stats.player pid, sum(stats.pts) pts,\
                        sum(stats.ast) ast, sum(stats.stl) stl, sum(stats.blk) blk, sum(stats.threepm) thr,\
                        sum(stats.reb) reb, sum(stats.ftm) ftm\
                    from player_stats stats,\
                        player p\
                    where stats.player = p.player_id "
                    + whereClause.year
                    + whereClause.team
                    + whereClause.height
                    + whereClause.weight
                    + "group by stats.player) ps,\
                    player p\
                where p.player_id = ps.pid\
                and ps.blk = :max_blk"
                + whereClause.attribute + ") t2";

    

    connection.execute(query, 
        [min_blk, max_blk], function(err, result){
        if (err) 
        { 
            console.log(err.message); 
            //res.send(err.message); 
        }

        console.log(result);
        stats.blocks.min_player = result.rows[0].MIN_PLAYER;
        stats.blocks.max_player = result.rows[0].MAX_PLAYER

        getPlayersForThrees(connection, teamName, fromYear, toYear, pos, attributeJson, stats, whereClause, res);
    });   
}

function getPlayersForThrees(connection, teamName, fromYear, toYear, pos, attributeJson, stats, whereClause, res) {
  
    console.log("Connection Established....");
    var min_thr = stats.threes.min;
    var max_thr = stats.threes.max;

    var query = "select min_player, max_player from \
                (select (p.last_name || ', ' || p.first_name) min_player\
                from (select stats.player pid, sum(stats.pts) pts,\
                        sum(stats.ast) ast, sum(stats.stl) stl, sum(stats.blk) blk, sum(stats.threepm) thr,\
                        sum(stats.reb) reb, sum(stats.ftm) ftm\
                    from player_stats stats,\
                        player p\
                    where stats.player = p.player_id " 
                    + whereClause.year
                    + whereClause.team
                    + whereClause.height
                    + whereClause.weight
                    + "group by stats.player) ps,\
                    player p\
                where p.player_id = ps.pid\
                and ps.thr = :min_thr"
                + whereClause.attribute + ") t1, \n"
                + "(select (p.last_name || ', ' || p.first_name) max_player\
                from (select stats.player pid, sum(stats.pts) pts,\
                        sum(stats.ast) ast, sum(stats.stl) stl, sum(stats.blk) blk, sum(stats.threepm) thr,\
                        sum(stats.reb) reb, sum(stats.ftm) ftm\
                    from player_stats stats,\
                        player p\
                    where stats.player = p.player_id "
                    + whereClause.year
                    + whereClause.team
                    + whereClause.height
                    + whereClause.weight
                    + "group by stats.player) ps,\
                    player p\
                where p.player_id = ps.pid\
                and ps.thr = :max_thr"
                + whereClause.attribute + ") t2";

    
    
    connection.execute(query, 
        [min_thr, max_thr], function(err, result){
        if (err) 
        { 
            console.log(err.message); 
            //res.send(err.message); 
        }

        console.log(result);
        stats.threes.min_player = result.rows[0].MIN_PLAYER;
        stats.threes.max_player = result.rows[0].MAX_PLAYER; 

        getPlayersForFreeThrows(connection, teamName, fromYear, toYear, pos, attributeJson, stats, whereClause, res);
    }); 
}

function getPlayersForFreeThrows(connection, teamName, fromYear, toYear, pos, attributeJson, stats, whereClause, res) {
  
    console.log("Connection Established....");
    var min_ftm = stats.freethrows.min;
    var max_ftm = stats.freethrows.max;

    var query = "select min_player, max_player from \
                (select (p.last_name || ', ' || p.first_name) min_player\
                from (select stats.player pid, sum(stats.pts) pts,\
                        sum(stats.ast) ast, sum(stats.stl) stl, sum(stats.blk) blk, sum(stats.threepm) thr,\
                        sum(stats.reb) reb, sum(stats.ftm) ftm\
                    from player_stats stats,\
                        player p\
                    where stats.player = p.player_id " 
                    + whereClause.year
                    + whereClause.team
                    + whereClause.height
                    + whereClause.weight
                    + "group by stats.player) ps,\
                    player p\
                where p.player_id = ps.pid\
                and ps.ftm = :min_ftm"
                + whereClause.attribute + ") t1, \n"
                + "(select (p.last_name || ', ' || p.first_name) max_player\
                from (select stats.player pid, sum(stats.pts) pts,\
                        sum(stats.ast) ast, sum(stats.stl) stl, sum(stats.blk) blk, sum(stats.threepm) thr,\
                        sum(stats.reb) reb, sum(stats.ftm) ftm\
                    from player_stats stats,\
                        player p\
                    where stats.player = p.player_id "
                    + whereClause.year
                    + whereClause.team
                    + whereClause.height
                    + whereClause.weight
                    + "group by stats.player) ps,\
                    player p\
                where p.player_id = ps.pid\
                and ps.ftm = :max_ftm"
                + whereClause.attribute + ") t2";

    
    
    connection.execute(query, 
        [min_ftm, max_ftm], function(err, result){
        if (err) 
        { 
            console.log(err.message); 
            //res.send(err.message); 
        }

        console.log(result);
        stats.freethrows.min_player = result.rows[0].MIN_PLAYER;
        stats.freethrows.max_player = result.rows[0].MAX_PLAYER

        getPlayersForHeight(connection, teamName, fromYear, toYear, pos, attributeJson, stats, whereClause, res)
    });  
}

function getPlayersForHeight(connection, teamName, fromYear, toYear, pos, attributeJson, stats, whereClause, res) {
  
    console.log("Connection Established....");
    var min_h = stats.height.min;
    var max_h = stats.height.max;

    var query = "select min_player, max_player from \
                (select (p.last_name || ', ' || p.first_name) min_player\
                from (select stats.player pid, sum(stats.pts) pts,\
                        sum(stats.ast) ast, sum(stats.stl) stl, sum(stats.blk) blk, sum(stats.threepm) thr,\
                        sum(stats.reb) reb, sum(stats.ftm) ftm\
                    from player_stats stats,\
                        player p\
                    where stats.player = p.player_id " 
                    + whereClause.year
                    + whereClause.team
                    + whereClause.height
                    + whereClause.weight
                    + "group by stats.player) ps,\
                    player p\
                where p.player_id = ps.pid\
                and p.height = :min_h"
                + whereClause.attribute + ") t1, \n"
                + "(select (p.last_name || ', ' || p.first_name) max_player\
                from (select stats.player pid, sum(stats.pts) pts,\
                        sum(stats.ast) ast, sum(stats.stl) stl, sum(stats.blk) blk, sum(stats.threepm) thr,\
                        sum(stats.reb) reb, sum(stats.ftm) ftm\
                    from player_stats stats,\
                        player p\
                    where stats.player = p.player_id "
                    + whereClause.year
                    + whereClause.team
                    + whereClause.height
                    + whereClause.weight
                    + "group by stats.player) ps,\
                    player p\
                where p.player_id = ps.pid\
                and p.height = :max_h"
                + whereClause.attribute + ") t2";

    
    
    connection.execute(query, 
        [min_h, max_h], function(err, result){
        if (err) 
        { 
            console.log(err.message); 
            //res.send(err.message); 
        }

        console.log(result);
        stats.height.min_player = result.rows[0].MIN_PLAYER;
        stats.height.max_player = result.rows[0].MAX_PLAYER; 

        getPlayersForWeight(connection, teamName, fromYear, toYear, pos, attributeJson, stats, whereClause, res);
    }); 
}

function getPlayersForWeight(connection, teamName, fromYear, toYear, pos, attributeJson, stats, whereClause, res) {
  
    console.log("Connection Established....");
    var min_w = stats.weight.min;
    var max_w = stats.weight.max;

    var query = "select min_player, max_player from \
                (select (p.last_name || ', ' || p.first_name) min_player\
                from (select stats.player pid, sum(stats.pts) pts,\
                        sum(stats.ast) ast, sum(stats.stl) stl, sum(stats.blk) blk, sum(stats.threepm) thr,\
                        sum(stats.reb) reb, sum(stats.ftm) ftm\
                    from player_stats stats,\
                        player p\
                    where stats.player = p.player_id " 
                    + whereClause.year
                    + whereClause.team
                    + whereClause.height
                    + whereClause.weight
                    + "group by stats.player) ps,\
                    player p\
                where p.player_id = ps.pid\
                and p.weight = :min_w"
                + whereClause.attribute + ") t1, \n"
                + "(select (p.last_name || ', ' || p.first_name) max_player\
                from (select stats.player pid, sum(stats.pts) pts,\
                        sum(stats.ast) ast, sum(stats.stl) stl, sum(stats.blk) blk, sum(stats.threepm) thr,\
                        sum(stats.reb) reb, sum(stats.ftm) ftm\
                    from player_stats stats,\
                        player p\
                    where stats.player = p.player_id "
                    + whereClause.year
                    + whereClause.team
                    + whereClause.height
                    + whereClause.weight
                    + "group by stats.player) ps,\
                    player p\
                where p.player_id = ps.pid\
                and p.weight = :max_w"
                + whereClause.attribute + ") t2";

    
    
    connection.execute(query, 
        [min_w, max_w], function(err, result){
        if (err) 
        { 
            console.log(err.message); 
            //res.send(err.message); 
        }

        console.log(result);
        stats.weight.min_player = result.rows[0].MIN_PLAYER;
        stats.weight.max_player = result.rows[0].MAX_PLAYER;

        console.log(stats);
        res.send(stats); 

        connection.close(function(err){
            if(err){
                console.log(err.message); 
                res.send(err.message); 
            }
            console.log("Connection Closed....");
        });

    }); 
}

router.get('/teams', function(req, res, next){
    console.log("Node JS: Team and Year dropdown API - Insights");
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
var attributeJson = {
        'assists' : {
            'set' : true,
            'min' : 1000,
            'max' : 2000
        },
        'points' : {
            'set' : true,
            'min' : 10000,
            'max' : 20000
        }
};

//getStats('BOS', 'C', attributeJson, null);
//getTeams(null);
module.exports = router;