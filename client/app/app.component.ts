import { Component } from '@angular/core';
import {TaskService} from './services/task.service';
import { PlayerService } from './services/player.service';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: 'app.component.html',
  providers:[TaskService, PlayerService]
})

export class AppComponent { }
