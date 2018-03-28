import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PlayerService{
    constructor(private http:Http){
        console.log('Player Service Initialized...');
    }
    
    getPlayers(){
        return this.http.get('/feature/players')
            .map(res => res.json());
    }
    
    // addPlayer(newPlayer){
    //     var headers = new Headers();
    //     headers.append('Content-Type', 'application/json');
    //     return this.http.post('/feature/player', JSON.stringify(newPlayer), {headers: headers})
    //         .map(res => res.json());
    // }
    
    searchPlayer(playerName){
        console.log(playerName);
        return this.http.get('/feature/players')
            .map(res => res.json());
    }
    // deleteTask(id){
    //     return this.http.delete('/api/task/'+id)
    //         .map(res => res.json());
    // }
    
    // updateStatus(task){
    //     var headers = new Headers();
    //     headers.append('Content-Type', 'application/json');
    //     return this.http.put('/api/task/'+task._id, JSON.stringify(task), {headers: headers})
    //         .map(res => res.json());
    // }
}