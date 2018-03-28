import { Component } from '@angular/core';
import {PlayerService} from '../../services/player.service';
import {Player} from '../../../Player';

@Component({
  moduleId: module.id,
  selector: 'players',
  templateUrl: 'players.component.html'
})

export class PlayersComponent { 
    players: Player[];
    firstName: string;
    
    constructor(private playerService:PlayerService){
        this.playerService.getPlayers()
            .subscribe(players => {
                console.log(players);
                this.players = players;
            });
    }
    
    searchPlayer(event){
        event.preventDefault();
        var newPlayer = {
            firstName: this.firstName
        }
        
        this.playerService.searchPlayer(newPlayer)
            .subscribe(players => {
                console.log(players);
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
