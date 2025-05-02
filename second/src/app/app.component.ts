import { Component, OnInit, SimpleChanges } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // Импорт RouterOutlet
import { NavComponent } from './components/nav/nav.component'; // Импорт NavComponent
import { LifecycleDemoComponent } from './components/lifecycle-demo/lifecycle-demo.component'; // Импорт LifecycleDemoComponent

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, // Подключение RouterOutlet
    NavComponent,
    LifecycleDemoComponent // Подключение LifecycleDemoComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  dataContent = 'Hello from parent!'; // Данные для передачи в контент дочернего компонента
  dataForChild = 'Hello from parent!'; // Данные для передачи в дочерний компонент

  ngOnInit() {
    setInterval(() => {
      // this.dataContent = Math.random().toString(); // Обновление данных для контент дочернего компонента
      // this.dataForChild = Math.random().toString(); // Обновление данных для дочернего компонента
    }, 2000); // Каждые 2 секунды
  }
 
}
