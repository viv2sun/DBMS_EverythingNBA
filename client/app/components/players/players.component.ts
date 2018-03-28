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

        this.map['TPTS'] = 'Total Points';
        this.map['TAST'] = 'Total Assists';
        this.map['TSTL'] = 'Total Steals';
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
