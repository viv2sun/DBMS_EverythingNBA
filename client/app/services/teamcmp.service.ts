import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class CompareTeamService{
    constructor(private http:Http){
        console.log('Compare Team Service Initialized...');
    }
    
    getTeams(){
        return this.http.get('/teamcmp/teams')
            .map(res => res.json());
    }

    compareTeams(team1, team2, year){
        return this.http.get('/teamcmp/compareteams'+team1+'/'+team2+'/'+year)
            .map(res => res.json());
    }
}