"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var leaderboard_service_1 = require('../../services/leaderboard.service');
require('rxjs/add/operator/toPromise');
var LeaderboardComponent = (function () {
    function LeaderboardComponent(leaderboardService) {
        this.leaderboardService = leaderboardService;
        this.objectKeys = Object.keys;
        // statsmap = {};
        this.lmap = {};
        this.positions = ['ALL', 'F', 'G', 'C'];
        this.records = [5, 10, 20, 50];
        this.stats = [{
                "code": "AST",
                "name": "Assists"
            }, {
                "code": "PTS",
                "name": "Points"
            }, {
                "code": "BLK",
                "name": "Blocks"
            }, {
                "code": "REB",
                "name": "Rebounds"
            }, {
                "code": "STL",
                "name": "Steals"
            }, {
                "code": "THREES",
                "name": "Threes"
            }];
        this.isRookie = false;
        this.isCalendarYear = false;
        this.resultCount = 0;
        // Squad Fields
        this.lmap['PNAME'] = 'Player';
        this.lmap['GAMES_PLAYED'] = 'Games';
        this.lmap['MINUTES_PLAYED'] = 'Minutes';
        this.lmap['POINTS'] = 'Points';
        this.lmap['ASSISTS'] = 'Assists';
        this.lmap['BLOCKS'] = 'Blocks';
        this.lmap['STEALS'] = 'Steals';
        this.lmap['THREES'] = 'Threes';
        this.lmap['REBOUNDS'] = 'Rebounds';
    }
    LeaderboardComponent.prototype.getTeams = function () {
        var _this = this;
        console.log("getTeams in LeaderboardComponent");
        this.leaderboardService.getTeams()
            .toPromise()
            .then(function (teamAndYear) {
            _this.years = teamAndYear.years;
            _this.teams = teamAndYear.teams;
            _this.teams.push({ "TEAM_ID": 'ALL', "NAME": 'All' });
            _this.dataLoaded = true;
        });
    };
    LeaderboardComponent.prototype.getLeaders = function (event, team, from, to, position, stat, recordNum, rookieFlag, calendarFlag) {
        var _this = this;
        console.log("Get Leaders " + team + " " + from + " " + to + " " + position + " " + stat + " " + recordNum + " " + rookieFlag + " " + calendarFlag);
        event.preventDefault();
        this.leaderboardService.getTopResults(team, from, to, position, stat, recordNum, rookieFlag, calendarFlag)
            .toPromise()
            .then(function (data) {
            console.log(data);
            _this.leaders = data;
            _this.resultCount = _this.leaders.length;
        });
    };
    LeaderboardComponent.prototype.ngOnInit = function () {
        this.dataLoaded = false;
        this.getTeams();
    };
    LeaderboardComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'leaderboard',
            templateUrl: 'leaderboard.component.html'
        }), 
        __metadata('design:paramtypes', [leaderboard_service_1.LeaderboardService])
    ], LeaderboardComponent);
    return LeaderboardComponent;
}());
exports.LeaderboardComponent = LeaderboardComponent;
//# sourceMappingURL=leaderboard.component.js.map