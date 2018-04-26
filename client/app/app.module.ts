import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {TasksComponent} from './components/tasks/tasks.component';
import { PlayersComponent } from './components/players/players.component';
import { CompareTeamsComponent } from './components/compareTeams/teamcmp.component';
import { TeamComponent } from './components/teams/teams.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { InsightsComponent } from './components/insights/insights.component';
import { ComparePlayersComponent } from './components/comparePlayers/playercmp.component';

@NgModule({
  imports:      [ BrowserModule, HttpModule, FormsModule ],
  declarations: [
                  AppComponent, 
                  TasksComponent, 
                  PlayersComponent,
                  CompareTeamsComponent,
                  TeamComponent,
                  LeaderboardComponent,
                  ComparePlayersComponent,
                  InsightsComponent
                ],
  bootstrap: [AppComponent]
})
export class AppModule { }
