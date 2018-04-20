import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {TasksComponent} from './components/tasks/tasks.component';
import { PlayersComponent } from './components/players/players.component';
import { CompareTeamsComponent } from './components/compareTeams/teamcmp.component';

@NgModule({
  imports:      [ BrowserModule, HttpModule, FormsModule ],
  declarations: [
                  AppComponent, 
                  TasksComponent, 
                  PlayersComponent,
                  CompareTeamsComponent
                ],
  bootstrap: [AppComponent]
})
export class AppModule { }
