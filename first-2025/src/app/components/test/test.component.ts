import {
  Component, OnInit, AfterContentInit, AfterContentChecked,
  ChangeDetectionStrategy, Input, DoCheck
} from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-test',
  imports: [CommonModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestComponent implements OnInit, AfterContentInit, AfterContentChecked {

  @Input() items: any = ['item1', 'item2', 'item3'];

  constructor() { }

  ngOnInit() {
    console.log('---ngOnInit - TestComponent initialized');
    for (let i = 0; i < 10000; i++) {
      const x = i;
      console.log('FOR', x);
    }
  }

  ngAfterContentInit() {
    console.log('---ngAfterContentInit');
  }

  ngAfterContentChecked() {
    console.log('---ngAfterContentChecked !!!!');
  }

  trackByIndex(index: number, item: string): number {
    return index;  // Track items by their index
  }



}
