import { Component, OnInit} from '@angular/core';
import {ComparePlayerService} from '../../services/playercmp.service';
import {Player} from '../../../Player';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Component({
  moduleId: module.id,
  selector: 'playercmp',
  templateUrl: 'playercmp.component.html'
})

export class ComparePlayersComponent implements OnInit { 
    selectedPlayer1 : Player;
    selectedPlayer2 : Player;
    players1: Player[];
    players2: Player[];
    player1Data : Object;
    player2Data : Object;
    player1Mates : String[];
    player2Mates : String[];
    player1Peak : number[];
    player2Peak : number[];
    dataLoaded : boolean;
    data : Object;
    objectKeys = Object.keys;

    map = {};
    constructor(private comparePlayerService:ComparePlayerService){
        
        this.map['TEAMS_PLAYED'] = 'Teams Played For';
        this.map['CONF_TITLE_COUNT'] = 'Conference Titles Won';
        this.map['RACE'] = 'Race';
        this.map['TPTS'] = 'Points';
        this.map['TAST'] = 'Assists';
        this.map['TSTL'] = 'Steals';
        this.map['TBLK'] = 'Blocks';
        this.map['TTO'] = 'Turnovers';
        this.map['TPF'] = 'Personal Fouls';
        this.map['TGP'] = 'Games Played';
        this.map['TGS'] = 'Games Started';
        this.map['TFGM'] = 'Field Goals Made';
        this.map['TFGA'] = 'Field Goals Attemped';
        this.map['TFTM'] = 'Free Throws Made';
        this.map['TFTA'] = 'Free Throws Attempted';
        this.map['THREEPM'] = '3 Points Made';
        this.map['THREEPA'] = '3 Points Attempted';
        this.map['TOREB'] = 'Offensive Rebounds';
        this.map['TDREB'] = 'Defensive Rebounds';
        this.map['TMIN'] = 'Total Minutes Played';
    }

    searchPlayer1(event, name) {
      console.log(name);
      event.preventDefault();
      this.comparePlayerService.searchPlayer(name)
        .toPromise()
        .then(players => {
          this.players1 = players;
        });
    }

    searchPlayer2(event, name) {
      console.log(name);
      event.preventDefault();
      this.comparePlayerService.searchPlayer(name)
        .toPromise()
        .then(players => {
          this.players2 = players;
        });
  }

    compare(event){
        console.log("Compare Player " + event);
        console.log(this.selectedPlayer1);
        var pid1 = this.selectedPlayer1.PLAYER_ID;
        var pid2 = this.selectedPlayer2.PLAYER_ID;
        console.log(this.selectedPlayer2);
        event.preventDefault();
        this.comparePlayerService.comparePlayers(pid1, pid2)
          .toPromise()
          .then(data => {
                  console.log(data);
                  this.data = data;
                  this.dataLoaded = true;
                  this.player1Data = data[pid1];
                  this.player2Data = data[pid2];
                  this.player1Mates = data[pid1].teamMates;
                  this.player2Mates = data[pid2].teamMates;
                  this.player1Peak = data[pid1].peakYears;
                  this.player2Peak = data[pid2].peakYears;
                  // console.log(this.team1Squad);
                  // console.log(this.team2Squad);
          });
    }

    setPlayer1(player){
      console.log(player);
      this.selectedPlayer1 = player;
    }

    setPlayer2(player){
      console.log(player);
      this.selectedPlayer2 = player;
    }

    ngOnInit() {
      this.dataLoaded = false;
    }
}
