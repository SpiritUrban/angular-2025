import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'first-2025';
  aditionalInfo = 'Super Mega Power';

  changeTitle(){
    this.title = 'Super Mega Power';
  }

}
