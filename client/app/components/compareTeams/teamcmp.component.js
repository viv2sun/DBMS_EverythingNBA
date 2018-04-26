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
var teamcmp_service_1 = require('../../services/teamcmp.service');
require('rxjs/add/operator/toPromise');
var CompareTeamsComponent = (function () {
    function CompareTeamsComponent(compareTeamService) {
        this.compareTeamService = compareTeamService;
        this.objectKeys = Object.keys;
        this.map = {};
        this.h2hmap = {};
        // HEAD TO HEAD Fields
        this.h2hmap['GAMES_PLAYED'] = 'Games Played';
        this.h2hmap['TOTAL_POINTS'] = 'Total Points';
        this.h2hmap['TOTAL_WINS'] = 'Total Wins';
        this.h2hmap['PLAYOFF_WINS'] = 'Playoff Wins';
        // Team Stats Fields
        this.map['GAMES_PLAYED'] = 'Games Played';
        this.map['DIV_RANK'] = 'Division Rank';
        this.map['CONF_RANK'] = 'Conference Rank';
        this.map['HOME_WIN'] = 'Home Wins';
        this.map['HOME_LOSS'] = 'Home Losses';
        this.map['AWAY_WIN'] = 'Away Wins';
        this.map['AWAY_LOSS'] = 'Away Losses';
        this.map['POINTS'] = 'Points';
        this.map['ASSISTS'] = 'Assists';
        this.map['STEALS'] = 'Steals';
        this.map['BLOCKS'] = 'Blocks';
        this.map['THREES'] = 'Threes Made';
        this.map['REBOUNDS'] = 'Rebounds';
    }
    CompareTeamsComponent.prototype.getTeams = function () {
        var _this = this;
        this.compareTeamService.getTeams()
            .toPromise()
            .then(function (teamAndYear) {
            _this.years = teamAndYear.years;
            _this.teams = teamAndYear.teams;
            _this.dataLoaded = true;
        });
    };
    CompareTeamsComponent.prototype.compare = function (event, team1, team2, year) {
        var _this = this;
        console.log("Compare Team " + team1 + " " + team2 + " " + year);
        event.preventDefault();
        this.compareTeamService.compareTeams(team1, team2, year)
            .toPromise()
            .then(function (data) {
            console.log(data);
            _this.data = data;
            if (data == '') {
                _this.noResults = true;
                _this.team1Data = undefined;
                _this.team2Data = undefined;
            }
            else {
                _this.noResults = false;
                _this.team1Data = data[team1];
                _this.team2Data = data[team2];
                _this.team1Squad = _this.team1Data['squad'];
                _this.team2Squad = _this.team2Data['squad'];
                console.log(_this.team1Data);
                console.log(_this.team2Data);
                console.log(_this.team1Squad);
                console.log(_this.team2Squad);
            }
        });
    };
    CompareTeamsComponent.prototype.ngOnInit = function () {
        this.dataLoaded = false;
        this.noResults = false;
        this.getTeams();
    };
    CompareTeamsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'teamcmp',
            templateUrl: 'teamcmp.component.html'
        }), 
        __metadata('design:paramtypes', [teamcmp_service_1.CompareTeamService])
    ], CompareTeamsComponent);
    return CompareTeamsComponent;
}());
exports.CompareTeamsComponent = CompareTeamsComponent;
//# sourceMappingURL=teamcmp.component.js.map