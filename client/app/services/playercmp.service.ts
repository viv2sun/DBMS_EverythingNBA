import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ComparePlayerService{
    constructor(private http:Http){
        console.log('Compare Player Service Initialized...');
    }
    
    searchPlayer(name){
        return this.http.get('/playercmp/searchplayer'+name)
            .map(res => res.json());
    }

    comparePlayers(player1, player2){
        return this.http.get('/playercmp/compareplayers'+player1+'/'+player2)
            .map(res => res.json());
    }
}