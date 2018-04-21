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
var player_service_1 = require('../../services/player.service');
var PlayersComponent = (function () {
    function PlayersComponent(playerService) {
        this.playerService = playerService;
        this.objectKeys = Object.keys;
        this.map = {};
        this.map['FIRST_NAME'] = 'First Name';
        this.map['LAST_NAME'] = 'Last Name';
        this.map['MIDDLE_NAME'] = 'Middle Name';
        this.map['COLLEGE'] = 'College';
        this.map['HEIGHT'] = 'Height';
        this.map['WEIGHT'] = 'Weight';
        this.map['COUNTRY'] = 'Country';
        this.map['BIRTH_CITY'] = 'Birth City';
        this.map['POSITION'] = 'Playing Position';
        this.map['TEAM'] = 'Teams Played For';
        this.map['TEAM_MATES'] = 'Popular Team Members';
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
    PlayersComponent.prototype.searchPlayer = function (event, name) {
        var _this = this;
        event.preventDefault();
        this.playerService.searchPlayer(name)
            .subscribe(function (players) {
            _this.players = players;
        });
    };
    PlayersComponent.prototype.viewPlayer = function (id) {
        var _this = this;
        this.playerService.viewPlayer(id)
            .subscribe(function (player) {
            console.log(player);
            _this.selectedPlayer = player;
        });
    };
    PlayersComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'players',
            templateUrl: 'players.component.html'
        }), 
        __metadata('design:paramtypes', [player_service_1.PlayerService])
    ], PlayersComponent);
    return PlayersComponent;
}());
exports.PlayersComponent = PlayersComponent;
//# sourceMappingURL=players.component.js.map