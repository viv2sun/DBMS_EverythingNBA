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
require('rxjs/add/operator/toPromise');
var insights_service_1 = require('../../services/insights.service');
var InsightsComponent = (function () {
    // team1Data : TeamCmp;
    // team2Data : TeamCmp;
    // team1Squad : Object[];
    // team2Squad : Object[];
    // map = {};
    // h2hmap = {};
    function InsightsComponent(insightsService) {
        this.insightsService = insightsService;
        this.objectKeys = Object.keys;
        this.positions = ['All', 'F', 'G', 'C'];
        this.attributes = {};
        this.filterValue = {};
        this.displayFilters = [{
                "code": "assists",
                "name": "Assists"
            }, {
                "code": "points",
                "name": "Points"
            }, {
                "code": "blocks",
                "name": "Blocks"
            }, {
                "code": "rebounds",
                "name": "Rebounds"
            }, {
                "code": "steals",
                "name": "Steals"
            }, {
                "code": "threes",
                "name": "Threes"
            }, {
                "code": "freethrows",
                "name": "Free Throws"
            }, {
                "code": "weight",
                "name": "Weight (inches)"
            }, {
                "code": "height",
                "name": "Height (lbs))"
            }];
    }
    InsightsComponent.prototype.getTeams = function () {
        var _this = this;
        this.insightsService.getTeams()
            .toPromise()
            .then(function (teamAndYear) {
            _this.years = teamAndYear.years;
            _this.teams = teamAndYear.teams;
            _this.teams.push({ "TEAM_ID": 'ALL', "NAME": 'All' });
            _this.dataLoaded = true;
        });
    };
    InsightsComponent.prototype.apply = function (event, team, fromYear, toYear, pos, attributes) {
        var _this = this;
        console.log(attributes);
        console.log("Apply Filters " + team + " " + fromYear + " " + toYear + " " + pos);
        this.attributeObj = {
            'points': {
                'set': attributes.pointsmin != undefined && attributes.pointsmax != undefined ? true : false,
                'min': attributes.pointsmin,
                'max': attributes.pointsmax
            },
            'assists': {
                'set': attributes.assistsmin != undefined && attributes.assistsmax != undefined ? true : false,
                'min': attributes.assistsmin,
                'max': attributes.assistsmax
            },
            'steals': {
                'set': attributes.stealsmin != undefined && attributes.stealsmax != undefined ? true : false,
                'min': attributes.stealsmin,
                'max': attributes.stealsmax
            },
            'blocks': {
                'set': attributes.blocksmin != undefined && attributes.blocksmax != undefined ? true : false,
                'min': attributes.blocksmin,
                'max': attributes.blocksmax
            },
            'rebounds': {
                'set': attributes.reboundsmin != undefined && attributes.reboundsmax != undefined ? true : false,
                'min': attributes.reboundsmin,
                'max': attributes.reboundsmax
            },
            'threes': {
                'set': attributes.threesmin != undefined && attributes.threesmax != undefined ? true : false,
                'min': attributes.threesmin,
                'max': attributes.threesmax
            },
            'height': {
                'set': attributes.heightmin != undefined && attributes.heightmax != undefined ? true : false,
                'min': attributes.heightmin,
                'max': attributes.heightmax
            },
            'weight': {
                'set': attributes.weightmin != undefined && attributes.weightmax != undefined ? true : false,
                'min': attributes.weightmin,
                'max': attributes.weightmax
            }
        };
        console.log(this.attributeObj);
        var attributeStr = JSON.stringify(this.attributeObj);
        event.preventDefault();
        this.insightsService.getInsights(team, fromYear, toYear, pos, attributeStr)
            .toPromise()
            .then(function (data) {
            console.log(data);
            _this.data = data;
            if (_this.chosenDF) {
                var val = _this.chosenDF['val'];
                _this.filterValue = _this.data[val];
            }
        });
    };
    InsightsComponent.prototype.onChangeFilter = function (value) {
        console.log(value);
        console.log(this.data);
        this.chosenDF = {
            val: value
        };
        if (this.data) {
            this.filterValue = this.data[value];
        }
    };
    InsightsComponent.prototype.ngOnInit = function () {
        this.dataLoaded = false;
        this.getTeams();
    };
    InsightsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'insights',
            templateUrl: 'insights.component.html'
        }), 
        __metadata('design:paramtypes', [insights_service_1.InsightsService])
    ], InsightsComponent);
    return InsightsComponent;
}());
exports.InsightsComponent = InsightsComponent;
//# sourceMappingURL=insights.component.js.map