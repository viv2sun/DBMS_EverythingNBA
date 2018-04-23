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
var team_service_1 = require('../../services/team.service');
require('rxjs/add/operator/toPromise');
var TeamComponent = (function () {
    function TeamComponent(teamService) {
        this.teamService = teamService;
        this.objectKeys = Object.keys;
        this.statsmap = {};
        this.squadmap = {};
        // Stats Fields
        this.statsmap['GAMES_PLAYED'] = 'Games Played';
        this.statsmap['DIV_RANK'] = 'Division Rank';
        this.statsmap['CONF_RANK'] = 'Conference Rank';
        this.statsmap['HOME_WIN'] = 'Home Wins';
        this.statsmap['HOME_LOSS'] = 'Home Losses';
        this.statsmap['AWAY_WIN'] = 'Away Wins';
        this.statsmap['AWAY_LOSS'] = 'Away Losses';
        this.statsmap['POINTS'] = 'Points';
        this.statsmap['ASSISTS'] = 'Assists';
        this.statsmap['STEALS'] = 'Steals';
        this.statsmap['BLOCKS'] = 'Blocks';
        this.statsmap['THREES'] = 'Threes';
        this.statsmap['REBOUNDS'] = 'Rebounds';
        // Squad Fields
        this.squadmap['PLAYER_NAME'] = 'Player';
        this.squadmap['POSITION'] = 'Position';
        this.squadmap['GAMES_PLAYED'] = 'Games';
        this.squadmap['MINUTES_PLAYED'] = 'Minutes';
        this.squadmap['POINTS'] = 'Points';
        this.squadmap['ASSISTS'] = 'Assists';
        this.squadmap['BLOCKS'] = 'Blocks';
        this.squadmap['THREES'] = 'Threes';
        this.squadmap['REBOUNDS'] = 'Rebounds';
    }
    TeamComponent.prototype.getTeams = function () {
        var _this = this;
        console.log("getTeams in TeamComponent");
        this.teamService.getTeams()
            .toPromise()
            .then(function (teamAndYear) {
            _this.years = teamAndYear.years;
            _this.teams = teamAndYear.teams;
            _this.dataLoaded = true;
        });
    };
    TeamComponent.prototype.viewTeam = function (event, team, year) {
        var _this = this;
        console.log("View Team " + team + " " + year);
        event.preventDefault();
        this.teamService.viewTeam(team, year)
            .toPromise()
            .then(function (data) {
            console.log(data);
            _this.data = data;
            _this.teamStats = data['stats'];
            _this.teamSquad = data['squad'];
        });
    };
    TeamComponent.prototype.ngOnInit = function () {
        this.dataLoaded = false;
        this.getTeams();
    };
    TeamComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'teams',
            templateUrl: 'teams.component.html'
        }), 
        __metadata('design:paramtypes', [team_service_1.TeamService])
    ], TeamComponent);
    return TeamComponent;
}());
exports.TeamComponent = TeamComponent;
//# sourceMappingURL=teams.component.js.map