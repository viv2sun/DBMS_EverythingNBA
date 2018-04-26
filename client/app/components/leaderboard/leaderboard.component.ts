import { Component, OnInit } from '@angular/core';
import { LeaderboardService } from '../../services/leaderboard.service';
import { TeamItem } from '../../../TeamList';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Leader } from '../../../Leader';

@Component({
  moduleId: module.id,
  selector: 'leaderboard',
  templateUrl: 'leaderboard.component.html'
})

export class LeaderboardComponent implements OnInit {
  years: number[];
  teams: TeamItem[];
  positions: String[];
  records: number[];
  leaders: Leader[];
  isRookie: boolean;
  isCalendarYear: boolean;
  resultCount: number;
  stats: Object[];
  dataLoaded: boolean;
  data: Object;
  objectKeys = Object.keys;

  // statsmap = {};
  lmap = {};
  constructor(private leaderboardService: LeaderboardService) {

    this.positions = ['ALL', 'F', 'G', 'C'];
    this.records = [5,10,20,50];

    this.stats = [{
      "code": "AST",
      "name": "Assists"
    }, {
      "code": "PTS",
      "name": "Points"
    }, {
      "code": "BLK",
      "name": "Blocks"
    }, {
      "code": "REB",
      "name": "Rebounds"
    }, {
      "code" : "STL",
      "name" : "Steals"
    }, {
      "code" : "THREES",
      "name" : "Threes"
    }];

    this.isRookie = false;
    this.isCalendarYear = false;
    this.resultCount = 0;

      // Squad Fields
      this.lmap['PNAME'] = 'Player';
      this.lmap['GAMES_PLAYED'] = 'Games';
      this.lmap['MINUTES_PLAYED'] = 'Minutes';
      this.lmap['POINTS'] = 'Points';
      this.lmap['ASSISTS'] = 'Assists';
      this.lmap['BLOCKS'] = 'Blocks';
      this.lmap['STEALS'] = 'Steals';
      this.lmap['THREES'] = 'Threes';
      this.lmap['REBOUNDS'] = 'Rebounds';
  }

  getTeams() {
    console.log("getTeams in LeaderboardComponent");
    this.leaderboardService.getTeams()
      .toPromise()
      .then(teamAndYear => {
        this.years = teamAndYear.years;
        this.teams = teamAndYear.teams;
        this.teams.push({"TEAM_ID" : 'ALL', "NAME" : 'All'});
        this.dataLoaded = true;
      });
  }

  getLeaders(event, team, from, to, position, stat, recordNum, rookieFlag, calendarFlag) {
      console.log("Get Leaders " + team + " " + from + " " + to + " " + position + " " + stat + " " + recordNum + " " + rookieFlag + " " + calendarFlag);
      event.preventDefault();
      this.leaderboardService.getTopResults(team, from, to, position, stat, recordNum, rookieFlag, calendarFlag)
        .toPromise()
        .then(data => {
                console.log(data);
                 this.leaders = data;
                 this.resultCount = this.leaders.length;
        });
  }

  ngOnInit() {
    this.dataLoaded = false;
    this.getTeams();
  }
}
