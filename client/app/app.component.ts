import { Component } from '@angular/core';
import {TaskService} from './services/task.service';
import { PlayerService } from './services/player.service';
import { CompareTeamService } from './services/teamcmp.service';
import { TeamService } from './services/team.service';
import { LeaderboardService } from './services/leaderboard.service';
import { InsightsService } from './services/insights.service';
import { ComparePlayerService } from './services/playercmp.service';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: 'app.component.html',
  providers:[TaskService, PlayerService, CompareTeamService, TeamService, LeaderboardService, InsightsService, ComparePlayerService]
})

export class AppComponent { 
  selectedFeature : string;
  selectedPageName : string;

  map = {};
  constructor(){
    // Map Page Names to pageSelectors

    this.map['View Player'] = 'viewPlayer';
    this.map['Compare Teams'] = 'compareTeam';
    this.map['View Squad'] = 'viewSquad';
    this.map['Leaderboard'] = 'leaderboard';
    this.map['Stat Insights'] = 'insights';
    this.map['Compare Players'] = 'comparePlayer';

    //this.selectedFeature = "viewPlayer";
    //this.selectedFeature = "compareTeam";
    //this.selectedFeature = "viewSquad";
    //this.selectedFeature = "leaderboard";
    this.selectedFeature = "comparePlayer";
    //this.selectedFeature = "insights";
  }

  setFeature(event){
    event.preventDefault();
    this.selectedPageName = event.srcElement.innerHTML;

    if(this.selectedFeature != this.map[this.selectedPageName]){
      this.selectedFeature = this.map[this.selectedPageName];
    }
    const document = event.srcElement.ownerDocument;
    
    for (const li of document.querySelectorAll("li.active")) {
      li.classList.remove("active");
    }
    event.srcElement.parentElement.classList.add("active");
  }
}
