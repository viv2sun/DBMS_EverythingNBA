import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class InsightsService{
    constructor(private http:Http){
        console.log('Insights Service Initialized...');
    }
    
    getTeams(){
        console.log("getTeams in InsightsService");
        return this.http.get('/insights/teams')
            .map(res => res.json());
    }

    getInsights(team, fromYear, toYear, pos, attributes){
        return this.http.get('/insights/getinsights'+team+'/'+fromYear+'/'+toYear+'/'+pos+'/'+attributes)
            .map(res => res.json());
    }
}