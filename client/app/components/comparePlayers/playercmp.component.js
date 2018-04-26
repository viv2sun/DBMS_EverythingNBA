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
var playercmp_service_1 = require('../../services/playercmp.service');
require('rxjs/add/operator/toPromise');
var ComparePlayersComponent = (function () {
    function ComparePlayersComponent(comparePlayerService) {
        this.comparePlayerService = comparePlayerService;
        this.objectKeys = Object.keys;
        this.map = {};
        this.map['TEAMS_PLAYED'] = 'Teams Played For';
        this.map['CONF_TITLE_COUNT'] = 'Conference Titles Won';
        this.map['RACE'] = 'Race';
        this.map['TPTS'] = 'Points';
        this.map['TAST'] = 'Assists';
        this.map['TSTL'] = 'Steals';
        this.map['TBLK'] = 'Blocks';
        this.map['TTO'] = 'Turnovers';
        this.map['TPF'] = 'Personal Fouls';
        this.map['TGP'] = 'Games Played';
        this.map['TGS'] = 'Games Started';
        this.map['TFGM'] = 'Field Goals Made';
        this.map['TFGA'] = 'Field Goals Attemped';
        this.map['TFTM'] = 'Free Throws Made';
        this.map['TFTA'] = 'Free Throws Attempted';
        this.map['THREEPM'] = '3 Points Made';
        this.map['THREEPA'] = '3 Points Attempted';
        this.map['TOREB'] = 'Offensive Rebounds';
        this.map['TDREB'] = 'Defensive Rebounds';
        this.map['TMIN'] = 'Total Minutes Played';
    }
    ComparePlayersComponent.prototype.searchPlayer1 = function (event, name) {
        var _this = this;
        console.log(name);
        event.preventDefault();
        this.comparePlayerService.searchPlayer(name)
            .toPromise()
            .then(function (players) {
            _this.players1 = players;
        });
    };
    ComparePlayersComponent.prototype.searchPlayer2 = function (event, name) {
        var _this = this;
        console.log(name);
        event.preventDefault();
        this.comparePlayerService.searchPlayer(name)
            .toPromise()
            .then(function (players) {
            _this.players2 = players;
        });
    };
    ComparePlayersComponent.prototype.compare = function (event) {
        var _this = this;
        console.log("Compare Player " + event);
        console.log(this.selectedPlayer1);
        var pid1 = this.selectedPlayer1.PLAYER_ID;
        var pid2 = this.selectedPlayer2.PLAYER_ID;
        console.log(this.selectedPlayer2);
        event.preventDefault();
        this.comparePlayerService.comparePlayers(pid1, pid2)
            .toPromise()
            .then(function (data) {
            console.log(data);
            _this.data = data;
            _this.dataLoaded = true;
            _this.player1Data = data[pid1];
            _this.player2Data = data[pid2];
            _this.player1Mates = data[pid1].teamMates;
            _this.player2Mates = data[pid2].teamMates;
            _this.player1Peak = data[pid1].peakYears;
            _this.player2Peak = data[pid1].peakYears;
            // console.log(this.team1Squad);
            // console.log(this.team2Squad);
        });
    };
    ComparePlayersComponent.prototype.setPlayer1 = function (player) {
        console.log(player);
        this.selectedPlayer1 = player;
    };
    ComparePlayersComponent.prototype.setPlayer2 = function (player) {
        console.log(player);
        this.selectedPlayer2 = player;
    };
    ComparePlayersComponent.prototype.ngOnInit = function () {
        this.dataLoaded = false;
    };
    ComparePlayersComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'playercmp',
            templateUrl: 'playercmp.component.html'
        }), 
        __metadata('design:paramtypes', [playercmp_service_1.ComparePlayerService])
    ], ComparePlayersComponent);
    return ComparePlayersComponent;
}());
exports.ComparePlayersComponent = ComparePlayersComponent;
//# sourceMappingURL=playercmp.component.js.map