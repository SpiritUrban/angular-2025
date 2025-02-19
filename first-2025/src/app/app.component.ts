import { Component, DoCheck } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TestComponent } from './components/test/test.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, CommonModule, TestComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements DoCheck {
  title = 'first-2025';
  isShowInput = true;
  itemsBufer = ['item1', 'item2', 'item3'];
  items = ['item1', 'item2', 'item3'];

  ngOnInit() {
    console.log('TestComponent initialized from AppComponent');
  }

  changeTitle(){
    this.title = 'Super Mega Power';
  }

  ngDoCheck(): void {
    console.log('---ngDoCheck');
     if (this.itemsBufer.length > 10000) {
      console.log('CLEARING ITEMS');
      this.itemsBufer = [];
    }
    for (let i = 0; i < 100; i++) {
      this.itemsBufer.push('' + i);
      console.log('FOR', this.itemsBufer.length);

    }
    this.items = [...this.itemsBufer];
  }



}
