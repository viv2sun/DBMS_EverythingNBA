import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TeamService{
    constructor(private http:Http){
        console.log('Team Service Initialized...');
    }
    
    getTeams(){
        console.log("getTeams in Teamservice");
        return this.http.get('/teams/getteamlist')
            .map(res => res.json());
    }

    viewTeam(team, year){
        return this.http.get('/teams/view'+team+'/'+year)
            .map(res => res.json());
    }
}