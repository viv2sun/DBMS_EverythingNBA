import { Component, OnInit} from '@angular/core';
import {CompareTeamService} from '../../services/teamcmp.service';
import {TeamItem} from '../../../TeamList';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Component({
  moduleId: module.id,
  selector: 'teamcmp',
  templateUrl: 'teamcmp.component.html'
})

export class CompareTeamsComponent implements OnInit { 
    years : number[];
    teams : TeamItem[];
    dataLoaded : boolean;
    data : Object;

    map = {};
    constructor(private compareTeamService:CompareTeamService){

    }

    getTeams() {
        this.compareTeamService.getTeams()
          .toPromise()
          .then(teamAndYear => {
            console.log("Inside Subscribe");
            console.log(teamAndYear);
            this.years = teamAndYear.years;
            this.teams = teamAndYear.teams;
            this.dataLoaded = true;
          });
    }

    compare(event, team1, team2, year){
        console.log(team1);
        console.log(team2);
        console.log(year);
        event.preventDefault();
        this.compareTeamService.compareTeams(team1, team2, year)
          .toPromise()
          .then(data => {
                  console.log("Hello");
                  console.log(data);
                  this.data = data;
          });

    }

    ngOnInit() {
      this.dataLoaded = false;
      this.getTeams();
    }
}
