import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class LeaderboardService{
    constructor(private http:Http){
        console.log('LeaderboardService Service Initialized...');
    }
    
    getTeams(){
        console.log("getTeams in LeaderboardService");
        return this.http.get('/leaderboard/getteams')
            .map(res => res.json());
    }

    getTopResults(team, from, to, position, stat, recordNum, rookieFlag, calendarFlag){
        return this.http.get('/leaderboard/view'+team+'/'+from+'/'+to+'/'+position+'/'+stat+'/'+recordNum+'/'+rookieFlag+'/'+calendarFlag)
            .map(res => res.json());
    }
}