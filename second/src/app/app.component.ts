import { Component, OnInit, DoCheck } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // Импорт RouterOutlet
import { NavComponent } from './components/nav/nav.component'; // Импорт NavComponent

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, // Подключение RouterOutlet
    NavComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, DoCheck {

  constructor() {
    console.log('1. Constructor');
  }
  
  ngOnInit() {
    console.log('3. OnInit');
  }

  ngDoCheck() {
    console.log('4. DoCheck');
  }
}
