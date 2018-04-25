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
            if(teamName != 'ALL') {
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
                attributeClause += " and ps.threepm between " + attributeJson.threes.min + " and " + attributeJson.threes.max;
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
                yearClause += " and ps.year between " + fromYear + " and " + toYear;
            }


            var posClause = "";
            if(pos != 'undefined') {
                posClause = " and p.postion like '%" + pos + "%' ";
            }

            var query = "select min(pts) pts_min, max(pts) pts_max, avg(pts) pts_avg,\
                            min(ast) ast_min, max(ast) ast_max, avg(ast) ast_avg,\
                            min(stl) stl_min, max(stl) stl_max, avg(stl) stl_avg,\
                            min(blk) blk_min, max(blk) blk_max, avg(blk) blk_avg,\
                            min(thr) thr_min, max(thr) thr_max, avg(thr) thr_avg,\
                            min(reb) reb_min, max(reb) reb_max, avg(reb) reb_avg,\
                            min(ftm) ftm_min, max(ftm) ftm_max, avg(ftm) ftm_avg\
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

            console.log(query);
            
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
                stats.assists.avg = result.rows[0].AST_AVG;

                stats.blocks = {};
                stats.blocks.min = result.rows[0].BLK_MIN;
                stats.blocks.max = result.rows[0].BLK_MAX;
                stats.blocks.avg = result.rows[0].BLK_AVG;

                stats.steals = {};
                stats.steals.min = result.rows[0].STL_MIN;
                stats.steals.max = result.rows[0].STL_MAX;
                stats.steals.avg = result.rows[0].STL_AVG;

                stats.points = {};
                stats.points.min = result.rows[0].PTS_MIN;
                stats.points.max = result.rows[0].PTS_MAX;
                stats.points.avg = result.rows[0].PTS_AVG;

                stats.rebounds = {};
                stats.rebounds.min = result.rows[0].REB_MIN;
                stats.rebounds.max = result.rows[0].REB_MAX;
                stats.rebounds.avg = result.rows[0].REB_AVG;

                stats.threes = {};
                stats.threes.min = result.rows[0].THR_MIN;
                stats.threes.max = result.rows[0].THR_MAX;
                stats.threes.avg = result.rows[0].THR_AVG;

                stats.freethrows = {};
                stats.freethrows.min = result.rows[0].FTM_MIN;
                stats.freethrows.max = result.rows[0].FTM_MAX;
                stats.freethrows.avg = result.rows[0].FTM_AVG;

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