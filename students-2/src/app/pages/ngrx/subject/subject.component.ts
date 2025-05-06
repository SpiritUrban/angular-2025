import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { defaultIfEmpty, filter, scan, startWith, tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-subject',
  imports: [CommonModule, RouterModule],
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent {
  // Створюємо Subject, який буде використовуватися для емісії значень
  private subject = new Subject<string>();

  basicState: string[] = ['a', 'b', 'c', 'd', 'e']; // Початковий масив значень
  // Створюємо масив для зберігання значень, які будуть накопичуватися

  // Створюємо Observable, який накопичує всі значення в масиві
  subject$ = this.subject.asObservable().pipe(
    tap((value: string) => console.log('tap', value)), // Логування значення
    // startWith(...this.basicState), // Эмитируем начальные значения из basicState
    scan((acc: string[], value: string) => [...acc, value], []), // Накопичуємо значення в масиві
    filter((value: string[]) => value.length > 0), // Фільтруємо масив, щоб він не був порожнім
    tap((value: string[]) => console.log('tap', value)), // Логування значення
    defaultIfEmpty(['default value']),

  );

  // Метод для додавання нового значення до Subject
  addSubject(newSubject: string): void {
    // Емісія нового значення
    this.subject.next(newSubject);
  }
  completeSubject(): void {
    // Завершення Subject
    this.subject.complete();
  }
}
