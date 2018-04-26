import { Component, OnInit} from '@angular/core';
import {CompareTeamService} from '../../services/teamcmp.service';
import {TeamItem} from '../../../TeamList';
import {TeamCmp} from '../../../TeamCompare';
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
    objectKeys = Object.keys;
    noResults: boolean;

    team1Data : TeamCmp;
    team2Data : TeamCmp;

    team1Squad : Object[];
    team2Squad : Object[];

    map = {};
    h2hmap = {};
    constructor(private compareTeamService:CompareTeamService){

      // HEAD TO HEAD Fields
      this.h2hmap['GAMES_PLAYED'] = 'Games Played';
      this.h2hmap['TOTAL_POINTS'] = 'Total Points';
      this.h2hmap['TOTAL_WINS'] = 'Total Wins';
      this.h2hmap['PLAYOFF_WINS'] = 'Playoff Wins';

      // Team Stats Fields
      this.map['GAMES_PLAYED'] = 'Games Played';
      this.map['DIV_RANK'] = 'Division Rank';
      this.map['CONF_RANK'] = 'Conference Rank';
      this.map['HOME_WIN'] = 'Home Wins';
      this.map['HOME_LOSS'] = 'Home Losses';
      this.map['AWAY_WIN'] = 'Away Wins';
      this.map['AWAY_LOSS'] = 'Away Losses';
      this.map['POINTS'] = 'Points';
      this.map['ASSISTS'] = 'Assists';
      this.map['STEALS'] = 'Steals';
      this.map['BLOCKS'] = 'Blocks';
      this.map['THREES'] = 'Threes Made';
      this.map['REBOUNDS'] = 'Rebounds';
    }

    getTeams() {
        this.compareTeamService.getTeams()
          .toPromise()
          .then(teamAndYear => {
            this.years = teamAndYear.years;
            this.teams = teamAndYear.teams;
            this.dataLoaded = true;
          });
    }

    compare(event, team1, team2, year){
        console.log("Compare Team " + team1 + " " + team2 + " " + year);
        event.preventDefault();
        this.compareTeamService.compareTeams(team1, team2, year)
          .toPromise()
          .then(data => {
                  console.log(data);
                  this.data = data;
                  if(data == ''){
                    this.noResults = true;
                    this.team1Data = undefined;
                    this.team2Data = undefined;
                  }
                  else {
                    this.noResults = false;
                    this.team1Data = data[team1];
                    this.team2Data = data[team2];
                    this.team1Squad = this.team1Data['squad'];
                    this.team2Squad = this.team2Data['squad'];
                    console.log(this.team1Data);
                    console.log(this.team2Data);
                    console.log(this.team1Squad);
                    console.log(this.team2Squad);
                  }
          });

    }

    ngOnInit() {
      this.dataLoaded = false;
      this.noResults = false;
      this.getTeams();
    }
}
