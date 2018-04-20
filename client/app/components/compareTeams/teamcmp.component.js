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
var CompareTeamsComponent = (function () {
    function CompareTeamsComponent(compareTeamService) {
        var _this = this;
        this.compareTeamService = compareTeamService;
        this.map = {};
        this.compareTeamService.getTeams()
            .subscribe(function (teamAndYear) {
            console.log("Inside Subscribe");
            console.log(teamAndYear);
            _this.years = teamAndYear.years;
            _this.teams = teamAndYear.teams;
            console.log(_this.teams[10]);
        });
    }
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