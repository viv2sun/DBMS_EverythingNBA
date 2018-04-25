import { Component, OnInit} from '@angular/core';
import {TeamItem} from '../../../TeamList';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { InsightsService } from '../../services/insights.service';

@Component({
  moduleId: module.id,
  selector: 'insights',
  templateUrl: 'insights.component.html'
})

export class InsightsComponent implements OnInit { 
    years : number[];
    teams : TeamItem[];
    dataLoaded : boolean;
    positions: String[];
    attributes: Object;
    attributeObj : Object;
    displayFilters : Object[];
    chosenDF : Object;
    filterValue : Object;
    data : Object;
    objectKeys = Object.keys;

    // team1Data : TeamCmp;
    // team2Data : TeamCmp;

    // team1Squad : Object[];
    // team2Squad : Object[];

    // map = {};
    // h2hmap = {};
    constructor(private insightsService:InsightsService){
      
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
        "code" : "steals",
        "name" : "Steals"
      }, {
        "code" : "threes",
        "name" : "Threes"
      }, {
        "code" : "freethrows",
        "name" : "Free Throws"
      }];
    //   // HEAD TO HEAD Fields
    //   this.h2hmap['GAMES_PLAYED'] = 'Games Played';
    //   this.h2hmap['TOTAL_POINTS'] = 'Total Points';
    //   this.h2hmap['TOTAL_WINS'] = 'Total Wins';
    //   this.h2hmap['PLAYOFF_WINS'] = 'Playoff Wins';

    //   // Team Stats Fields
    //   this.map['GAMES_PLAYED'] = 'Games Played';
    //   this.map['DIV_RANK'] = 'Division Rank';
    //   this.map['CONF_RANK'] = 'Conference Rank';
    //   this.map['HOME_WIN'] = 'Home Wins';
    //   this.map['HOME_LOSS'] = 'Home Losses';
    //   this.map['AWAY_WIN'] = 'Away Wins';
    //   this.map['AWAY_LOSS'] = 'Away Losses';
    //   this.map['POINTS'] = 'Points';
    //   this.map['ASSISTS'] = 'Assists';
    //   this.map['STEALS'] = 'Steals';
    //   this.map['BLOCKS'] = 'Blocks';
    //   this.map['THREES'] = 'Threes Made';
    //   this.map['REBOUNDS'] = 'Rebounds';
    }

    getTeams() {
        this.insightsService.getTeams()
          .toPromise()
          .then(teamAndYear => {
            this.years = teamAndYear.years;
            this.teams = teamAndYear.teams;
            this.teams.push({"TEAM_ID" : 'ALL', "NAME" : 'All'});
            this.dataLoaded = true;
          });
    }

    apply(event, team, fromYear, toYear, pos, attributes){
      console.log(attributes);
      console.log("Apply Filters " + team + " " + fromYear + " " + toYear + " " + pos);
      this.attributeObj = {
        'points' : {
          'set' : attributes.pointsmin != undefined && attributes.pointsmax != undefined ? true : false,
          'min' : attributes.pointsmin,
          'max' : attributes.pointsmax
        },
        'assists' : {
          'set' : attributes.assistsmin != undefined && attributes.assistsmax != undefined ? true : false,
          'min' : attributes.assistsmin,
          'max' : attributes.assistsmax
        },
        'steals' : {
          'set' : attributes.stealsmin != undefined && attributes.stealsmax != undefined ? true : false,
          'min' : attributes.stealsmin,
          'max' : attributes.stealsmax
        },
        'blocks' : {
          'set' : attributes.blocksmin != undefined && attributes.blocksmax != undefined ? true : false,
          'min' : attributes.blocksmin,
          'max' : attributes.blocksmax
        },
        'rebounds' : {
          'set' : attributes.reboundsmin != undefined && attributes.reboundsmax != undefined ? true : false,
          'min' : attributes.reboundsmin,
          'max' : attributes.reboundsmax
        },
        'threes' : {
          'set' : attributes.threesmin != undefined && attributes.threesmax != undefined ? true : false,
          'min' : attributes.threesmin,
          'max' : attributes.threesmax
        },
        'height' : {
          'set' : attributes.heightmin != undefined && attributes.heightmax != undefined ? true : false,
          'min' : attributes.heightmin,
          'max' : attributes.heightmax
        },
        'weight' : {
          'set' : attributes.weightmin != undefined && attributes.weightmax != undefined ? true : false,
          'min' : attributes.weightmin,
          'max' : attributes.weightmax
        }
      };

      console.log(this.attributeObj);
      var attributeStr = JSON.stringify(this.attributeObj);
      event.preventDefault();
      this.insightsService.getInsights(team, fromYear, toYear, pos, attributeStr)
          .toPromise()
          .then(data => {
                  console.log(data);
                  this.data = data;
                  if(this.chosenDF){
                    var val = this.chosenDF['val'];
                    this.filterValue = this.data[val];
                  }
          });
    }

    onChangeFilter(value){
      console.log(value);
      console.log(this.data);
      this.chosenDF = {
        val : value
      };
      if(this.data){
        this.filterValue = this.data[value];
      }
    }

    ngOnInit() {
      this.dataLoaded = false;
      this.getTeams();
    }
}
