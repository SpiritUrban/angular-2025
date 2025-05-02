import { Component, Input, OnChanges, OnInit, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy, SimpleChanges, ViewChild, ContentChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-lifecycle-demo',
  standalone: true,
  imports: [],
  templateUrl: './lifecycle-demo.component.html',
  styleUrl: './lifecycle-demo.component.scss'
})
export class LifecycleDemoComponent implements
  OnChanges, OnInit, DoCheck,
  AfterContentInit, AfterContentChecked,
  AfterViewInit, AfterViewChecked, OnDestroy {

  @Input() data: any;
  @ViewChild('viewChild') viewChild!: ElementRef;
  @ContentChild('contentChild') contentChild!: ElementRef;

  innerData = 'Hello from child!'; 

  // Единоразовые хуки
  // Но конструктор это не хук про сути
  constructor() {
    // Вызывается при создании компонента
    // Обычно подключаем сервисы
    console.log('1. Constructor');
  }

  ngOnInit() {
    // Вызывается один раз после инициализации входных данных
    console.log('3. OnInit');
    setInterval(() => {
      this.innerData = Math.random().toString(); // Изменяем данные в дочернем компоненте
      console.log('Inner data changed:', this.innerData);
    }, 2000); // Каждые 2 секунды
  }

  ngAfterContentInit() {
    // Вызывается один раз после вставки контента через <ng-content>
    console.log('5. AfterContentInit');
    console.log('ContentChild:', this.contentChild);
  }

  ngAfterViewInit() {
    // Вызывается один раз после инициализации представления компонента
    console.log('7. AfterViewInit');
    console.log('ViewChild:', this.viewChild);
  }

  ngOnDestroy() {
    // Вызывается один раз перед уничтожением компонента
    console.log('9. OnDestroy');
  }

  // Хуки, срабатывающие на изменения
  ngOnChanges(changes: SimpleChanges) {
    // Вызывается при изменении входных данных (@Input)
    console.log('2. OnChanges:', changes);
  }

  ngDoCheck() {
    // Вызывается при каждой проверке изменений
    console.log('4. DoCheck');
  }

  ngAfterContentChecked() {
    // Вызывается при каждой проверке изменений в контенте
    console.log('6. AfterContentChecked');
  }

  ngAfterViewChecked() {
    // Вызывается при каждой проверке изменений в представлении
    console.log('8. AfterViewChecked');
  }
}