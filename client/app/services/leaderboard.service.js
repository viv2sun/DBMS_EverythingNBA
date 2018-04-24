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
var http_1 = require('@angular/http');
require('rxjs/add/operator/map');
var LeaderboardService = (function () {
    function LeaderboardService(http) {
        this.http = http;
        console.log('LeaderboardService Service Initialized...');
    }
    LeaderboardService.prototype.getTeams = function () {
        console.log("getTeams in LeaderboardService");
        return this.http.get('/leaderboard/getteams')
            .map(function (res) { return res.json(); });
    };
    LeaderboardService.prototype.getTopResults = function (team, from, to, position, stat, recordNum, rookieFlag) {
        return this.http.get('/leaderboard/view' + team + '/' + from + '/' + to + '/' + position + '/' + stat + '/' + recordNum + '/' + rookieFlag)
            .map(function (res) { return res.json(); });
    };
    LeaderboardService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], LeaderboardService);
    return LeaderboardService;
}());
exports.LeaderboardService = LeaderboardService;
//# sourceMappingURL=leaderboard.service.js.map