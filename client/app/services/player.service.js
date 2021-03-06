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
var PlayerService = (function () {
    function PlayerService(http) {
        this.http = http;
        console.log('Player Service Initialized...');
    }
    PlayerService.prototype.getPlayers = function () {
        return this.http.get('/feature/players')
            .map(function (res) { return res.json(); });
    };
    // addPlayer(newPlayer){
    //     var headers = new Headers();
    //     headers.append('Content-Type', 'application/json');
    //     return this.http.post('/feature/player', JSON.stringify(newPlayer), {headers: headers})
    //         .map(res => res.json());
    // }
    PlayerService.prototype.searchPlayer = function (name) {
        console.log(name);
        return this.http.get('/feature/player/search/' + name)
            .map(function (res) { return res.json(); });
    };
    PlayerService.prototype.viewPlayer = function (id) {
        console.log(id);
        return this.http.get('/feature/player/' + id)
            .map(function (res) { return res.json(); });
    };
    PlayerService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], PlayerService);
    return PlayerService;
}());
exports.PlayerService = PlayerService;
//# sourceMappingURL=player.service.js.map