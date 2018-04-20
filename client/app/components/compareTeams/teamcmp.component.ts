import { Component } from '@angular/core';
import {CompareTeamService} from '../../services/teamcmp.service';
import {TeamItem} from '../../../TeamList';

@Component({
  moduleId: module.id,
  selector: 'teamcmp',
  templateUrl: 'teamcmp.component.html'
})

export class CompareTeamsComponent { 
    years : number[];
    teams : TeamItem[];

    map = {};
    constructor(private compareTeamService:CompareTeamService){
      this.compareTeamService.getTeams()
          .subscribe(teamAndYear => {
            console.log("Inside Subscribe");
            console.log(teamAndYear);
            this.years = teamAndYear.years;
            this.teams = teamAndYear.teams;
            console.log(this.teams[10]);
          });
    }
}
