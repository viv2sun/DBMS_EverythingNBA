import { Component } from '@angular/core';
import {PlayerService} from '../../services/player.service';
import {Player} from '../../../Player';

@Component({
  moduleId: module.id,
  selector: 'players',
  templateUrl: 'players.component.html'
})

export class PlayersComponent { 
    selectedPlayer : Player;
    players: Player[];
    name: string;
    objectKeys = Object.keys;

    map = {};
    constructor(private playerService:PlayerService){
        this.map['FIRST_NAME'] = 'First Name';
        this.map['LAST_NAME'] = 'Last Name';
        this.map['MIDDLE_NAME'] = 'Middle Name';
        this.map['COLLEGE'] = 'College';
        this.map['HEIGHT'] = 'Height';
        this.map['WEIGHT'] = 'Weight';
        this.map['COUNTRY'] = 'Country';
        this.map['BIRTH_CITY'] = 'Birth City';
        this.map['POSITION'] = 'Playing Position';
        this.map['TEAM'] = 'Teams Played For';
        this.map['TEAM_MATES'] = 'Popular Team Members';
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
        // this.playerService.getPlayers()
        //     .subscribe(players => {
        //         console.log(players);
        //         this.players = players;
        //     });
    }
    
    searchPlayer(event, name){
        event.preventDefault();
        this.playerService.searchPlayer(name)
            .subscribe(players => {
                console.log(players);
                this.players = players;
            });
    }

    viewPlayer(id){
        this.playerService.viewPlayer(id)
            .subscribe(player => {
                console.log(player);
                this.selectedPlayer = player;
            });
    }
    
    // deleteTask(id){
    //     var tasks = this.tasks;
        
    //     this.taskService.deleteTask(id).subscribe(data => {
    //         if(data.n == 1){
    //             for(var i = 0;i < tasks.length;i++){
    //                 if(tasks[i].id == id){
    //                     tasks.splice(i, 1);
    //                 }
    //             }
    //         }
    //     });
    // }
    
    // updateStatus(task){
    //     var _task = {
    //         _id:task._id,
    //         title: task.title,
    //         isDone: !task.isDone
    //     };
        
    //     this.taskService.updateStatus(_task).subscribe(data => {
    //         task.isDone = !task.isDone;
    //     });
    // }
}
