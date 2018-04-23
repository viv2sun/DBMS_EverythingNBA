import { Component, OnInit} from '@angular/core';
import {TeamService} from '../../services/team.service';
import {TeamItem} from '../../../TeamList';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { TeamStats } from '../../../Team';
import { Squad } from '../../../TeamSquad';

@Component({
  moduleId: module.id,
  selector: 'teams',
  templateUrl: 'teams.component.html'
})

export class TeamComponent implements OnInit { 
    years : number[];
    teams : TeamItem[];
    teamStats: TeamStats;
    teamSquad: Squad[];
    dataLoaded : boolean;
    data : Object;
    objectKeys = Object.keys;

    statsmap = {};
    squadmap = {};
    constructor(private teamService:TeamService){

      // Stats Fields
      this.statsmap['GAMES_PLAYED'] = 'Games Played';
      this.statsmap['DIV_RANK'] = 'Division Rank';
      this.statsmap['CONF_RANK'] = 'Conference Rank';
      this.statsmap['HOME_WIN'] = 'Home Wins';
      this.statsmap['HOME_LOSS'] = 'Home Losses';
      this.statsmap['AWAY_WIN'] = 'Away Wins';
      this.statsmap['AWAY_LOSS'] = 'Away Losses';
      this.statsmap['POINTS'] = 'Points';
      this.statsmap['ASSISTS'] = 'Assists';
      this.statsmap['STEALS'] = 'Steals';
      this.statsmap['BLOCKS'] = 'Blocks';
      this.statsmap['THREES'] = 'Threes';
      this.statsmap['REBOUNDS'] = 'Rebounds';

      // Squad Fields
      this.squadmap['PLAYER_NAME'] = 'Player';
      this.squadmap['POSITION'] = 'Position';
      this.squadmap['GAMES_PLAYED'] = 'Games';
      this.squadmap['MINUTES_PLAYED'] = 'Minutes';
      this.squadmap['POINTS'] = 'Points';
      this.squadmap['ASSISTS'] = 'Assists';
      this.squadmap['BLOCKS'] = 'Blocks';
      this.squadmap['THREES'] = 'Threes';
      this.squadmap['REBOUNDS'] = 'Rebounds';
    }

    getTeams() {
        console.log("getTeams in TeamComponent");
        this.teamService.getTeams()
          .toPromise()
          .then(teamAndYear => {
            this.years = teamAndYear.years;
            this.teams = teamAndYear.teams;
            this.dataLoaded = true;
          });
    }

    viewTeam(event, team, year) {
        console.log("View Team " + team + " " + year);
        event.preventDefault();
        this.teamService.viewTeam(team, year)
          .toPromise()
          .then(data => {
                  console.log(data);
                   this.data = data;
                   this.teamStats = data['stats'];
                   this.teamSquad = data['squad'];
          });
    }

    ngOnInit() {
      this.dataLoaded = false;
      this.getTeams();
    }
}
