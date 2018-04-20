import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class CompareTeamService{
    constructor(private http:Http){
        console.log('Compare Team Service Initialized...');
    }
    
    getTeams(){
        console.log('Get Teams');
        return this.http.get('/teamcmp/teams')
            .map(res => res.json());
    }
}