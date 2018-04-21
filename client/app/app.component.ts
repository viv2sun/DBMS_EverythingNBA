import { Component } from '@angular/core';
import {TaskService} from './services/task.service';
import { PlayerService } from './services/player.service';
import { CompareTeamService } from './services/teamcmp.service';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: 'app.component.html',
  providers:[TaskService, PlayerService, CompareTeamService]
})

export class AppComponent { 
  selectedFeature : string;
  selectedPageName : string;

  map = {};
  constructor(){
    // Map Page Names to pageSelectors

    this.map['View Player'] = 'viewPlayer';
    this.map['Compare Teams'] = 'compareTeam';

    //this.selectedFeature = "viewPlayer";
    this.selectedFeature = "compareTeam";
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
