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
var task_service_1 = require('./services/task.service');
var player_service_1 = require('./services/player.service');
var teamcmp_service_1 = require('./services/teamcmp.service');
var AppComponent = (function () {
    function AppComponent() {
        // Map Page Names to pageSelectors
        this.map = {};
        this.map['View Player'] = 'viewPlayer';
        this.map['Compare Teams'] = 'compareTeam';
        this.selectedFeature = "viewPlayer";
        //this.selectedFeature = "compareTeam";
    }
    AppComponent.prototype.setFeature = function (event) {
        event.preventDefault();
        this.selectedPageName = event.srcElement.innerHTML;
        console.log(this.map[this.selectedPageName]);
        if (this.selectedFeature != this.map[this.selectedPageName]) {
            this.selectedFeature = this.map[this.selectedPageName];
        }
        var document = event.srcElement.ownerDocument;
        for (var _i = 0, _a = document.querySelectorAll("li.active"); _i < _a.length; _i++) {
            var li = _a[_i];
            li.classList.remove("active");
        }
        event.srcElement.parentElement.classList.add("active");
    };
    AppComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'my-app',
            templateUrl: 'app.component.html',
            providers: [task_service_1.TaskService, player_service_1.PlayerService, teamcmp_service_1.CompareTeamService]
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map