# TypeScript: Типы данных, интерфейсы, классы, дженерики

## Основные типы данных

### 1. Примитивные типы

```typescript
// Числа
let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;

// Строки
let color: string = "blue";
let fullName: string = `John Doe`;
let sentence: string = `Hello, ${fullName}`;

// Логические значения
let isDone: boolean = false;

// Null и Undefined
let u: undefined = undefined;
let n: null = null;
```

### 2. Массивы и кортежи

```typescript
// Массивы
let list: number[] = [1, 2, 3];
let generic: Array<number> = [1, 2, 3];

// Кортежи
let tuple: [string, number] = ["hello", 10];
let [text, value] = tuple; // Деструктуризация
```

Кортежи в TypeScript фиксируют **структуру типов по индексам**. Например:

```typescript
let tuple: [string, number] = ["hello", 10];
```

- `tuple[0]` всегда **строка**.
- `tuple[1]` всегда **число**.

Если поменять местами типы:

```typescript
let wrongTuple: [string, number] = [10, "hello"]; // Ошибка!
```

TypeScript выдаст ошибку.

Для неизменяемости кортежа используйте `readonly`:

```typescript
const readonlyTuple: readonly [string, number] = ["fixed", 123];
```

## Интерфейсы

### 1. Базовые интерфейсы

```typescript
interface User {
  id: number;
  name: string;
  email?: string; // Опциональное поле
  readonly createdAt: Date; // Только для чтения
}
```

### 2. Расширение интерфейсов

```typescript
interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Admin extends User {
  permissions: string[];
}
```

## Классы

```typescript
class Animal {
  private name: string;
  protected age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  public getName(): string {
    return this.name;
  }
}
```

### Наследование

```typescript
class Dog extends Animal {
  bark(): void {
    console.log(`${this.getName()} says: Woof!`);
  }
}
```

### Абстрактные классы

```typescript
abstract class Shape {
  abstract getArea(): number;
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  getArea(): number {
    return Math.PI * this.radius ** 2;
  }
}
```

## Дженерики

```typescript
function identity<T>(arg: T): T {
  return arg;
}

let result = identity<string>("hello");
let inferred = identity(42);
```

### Дженерик интерфейс

```typescript
interface GenericResponse<T> {
  data: T;
  status: number;
  message: string;
}
```

### Использование нескольких дженериков

```typescript
class MultiGeneric<A, B, C, D, E, F> {
  constructor(
    public first: A,
    public second: B,
    public third: C,
    public fourth: D,
    public fifth: E,
    public sixth: F
  ) {}
}
```

## Декораторы

```typescript
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class BankAccount {
  private balance: number = 0;

  deposit(amount: number) {
    this.balance += amount;
  }
}
```

## Angular: Типизация

```typescript
@Component({
  selector: 'app-product-list',
  template: `
    <div *ngFor="let product of products">
      {{ product.name }} - {{ product.price }}
    </div>
  `
})
export class ProductListComponent {
  products: Product[] = [];

  @Input() category?: string;
  @Output() select = new EventEmitter<Product>();
}
```

## Лучшие практики

### 1. Организация типов

```typescript
export interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. Строгая типизация

```typescript
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```


---

# RxJS: Полное руководство по реактивному программированию в JavaScript

## Введение в RxJS

RxJS (Reactive Extensions for JavaScript) — библиотека для реактивного программирования, позволяющая управлять асинхронными потоками данных с помощью `Observable`.

---
## Основные концепции

### 1. Observable

```typescript
import { Observable } from 'rxjs';

const numbers$ = new Observable<number>(subscriber => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  subscriber.complete();
});

numbers$.subscribe({
  next: value => console.log(value),
  error: err => console.error(err),
  complete: () => console.log('Completed')
});
```

### 2. Subject

`Subject` — позволяет передавать данные подписчикам.

```typescript
import { Subject } from 'rxjs';

const subject$ = new Subject();
subject$.subscribe(value => console.log('A:', value));
subject$.next('Hello');
subject$.subscribe(value => console.log('B:', value));
subject$.next('World');
```

#### Разновидности Subject:
- **BehaviorSubject** – хранит последнее значение.
- **ReplaySubject** – запоминает несколько последних значений.
- **AsyncSubject** – выдаёт только последнее значение после завершения потока.

---
## Операторы RxJS

### 1. Трансформационные операторы

```typescript
import { map, filter, tap, mergeMap } from 'rxjs/operators';

// map
numbers$.pipe(
  map(n => n * 2)
).subscribe(console.log);

// filter
numbers$.pipe(
  filter(n => n % 2 === 0)
).subscribe(console.log);

// tap
numbers$.pipe(
  tap(n => console.log('Before:', n)),
  map(n => n * 2),
  tap(n => console.log('After:', n))
).subscribe();
```

### 2. Управление временем

```typescript
import { debounceTime, throttleTime, delay } from 'rxjs/operators';

// debounceTime
search$.pipe(debounceTime(300)).subscribe(console.log);

// throttleTime
clicks$.pipe(throttleTime(1000)).subscribe(console.log);
```

### 3. Комбинирование потоков

```typescript
import { combineLatest, merge, concat, zip } from 'rxjs';

combineLatest([stream1$, stream2$]).subscribe(console.log);
merge(stream1$, stream2$).subscribe(console.log);
concat(stream1$, stream2$).subscribe(console.log);
zip(stream1$, stream2$).subscribe(console.log);
```

### 4. Обработка ошибок

```typescript
import { catchError, retry } from 'rxjs/operators';

api$.pipe(
  catchError(error => of('Fallback value'))
).subscribe(console.log);

api$.pipe(
  retry(3)
).subscribe(console.log);
```

---
## Практические примеры

### 1. Автодополнение поиска

```typescript
@Component({
  selector: 'app-search',
  template: `
    <input [formControl]="searchControl">
    <div *ngFor="let result of results$ | async">{{ result.name }}</div>
  `
})
export class SearchComponent implements OnInit {
  searchControl = new FormControl('');
  results$: Observable<SearchResult[]>;

  constructor(private searchService: SearchService) {}

  ngOnInit() {
    this.results$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(term => term.length >= 2),
      switchMap(term => this.searchService.search(term)),
      catchError(() => of([]))
    );
  }
}
```

### 2. Кэширование данных

```typescript
@Injectable({ providedIn: 'root' })
export class CacheService {
  private cache = new Map<string, Observable<any>>();

  getData(key: string, fetcher: () => Observable<any>): Observable<any> {
    if (!this.cache.has(key)) {
      this.cache.set(key, fetcher().pipe(shareReplay(1)));
    }
    return this.cache.get(key);
  }
}
```

---
## Подписка и завершение потока

- **unsubscribe()** – отписка от потока.
- **complete()** – завершает поток, отписывая подписчиков.
- **error()** – завершает поток с ошибкой.

### Отмена подписок

```typescript
import { takeUntil } from 'rxjs/operators';

const destroy$ = new Subject<void>();

numbers$.pipe(
  takeUntil(destroy$)
).subscribe(console.log);

destroy$.next();
destroy$.complete();
```

---
## Итог

RxJS предоставляет мощные инструменты для работы с асинхронными данными. `mergeMap`, `switchMap` и `concatMap` позволяют гибко управлять потоками, а `catchError` и `retryWhen` обеспечивают надёжную обработку ошибок.


---

# Observable: Создание и подписка на потоки данных

## Создание Observable

### 1. Базовое создание

```typescript
import { Observable, of, from } from 'rxjs';

// Создание с помощью конструктора
const manual$ = new Observable<number>(subscriber => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  subscriber.complete();
});

// Создание из значений
const values$ = of(1, 2, 3, 4, 5);

// Создание из массива
const array$ = from([1, 2, 3, 4, 5]);

// Создание из Promise
const promise$ = from(fetch('/api/data'));
```

### 2. Создание из событий

```typescript
import { fromEvent } from 'rxjs';

// События DOM
const clicks$ = fromEvent(document, 'click');
const keypress$ = fromEvent<KeyboardEvent>(document, 'keypress');

// Пользовательские события
class EventEmitter<T> {
  private listeners: ((value: T) => void)[] = [];

  emit(value: T) {
    this.listeners.forEach(listener => listener(value));
  }

  asObservable(): Observable<T> {
    return new Observable<T>(subscriber => {
      this.listeners.push(value => subscriber.next(value));
    });
  }
}
```

## Операторы RxJS

### 1. Операторы преобразования

```typescript
import { map, filter, tap, mergeMap, switchMap, concatMap } from 'rxjs/operators';

// map - преобразование значений
const doubled$ = numbers$.pipe(
  map(n => n * 2)
);

// filter - фильтрация значений
const even$ = numbers$.pipe(
  filter(n => n % 2 === 0)
);

// mergeMap - параллельные запросы
const userDetails$ = userIds$.pipe(
  mergeMap(id => this.http.get(`/api/users/${id}`))
);

// switchMap - отмена предыдущих запросов
const searchResults$ = searchTerm$.pipe(
  switchMap(term => this.http.get(`/api/search?q=${term}`))
);

// concatMap - последовательные запросы
const orderedRequests$ = requests$.pipe(
  concatMap(req => this.http.post('/api/data', req))
);
```

### 2. Операторы комбинирования

```typescript
import { combineLatest, merge, zip, forkJoin } from 'rxjs';

// combineLatest - комбинирование последних значений
const combined$ = combineLatest([
  userProfile$,
  userSettings$
]).pipe(
  map(([profile, settings]) => ({
    ...profile,
    ...settings
  }))
);

// merge - объединение потоков
const allEvents$ = merge(
  clicks$,
  keypress$,
  touchEvents$
);

// zip - попарное объединение
const zipped$ = zip(
  coordinates$,
  timestamps$
).pipe(
  map(([coord, time]) => ({
    position: coord,
    timestamp: time
  }))
);

// forkJoin - ожидание завершения всех потоков
const apiData$ = forkJoin({
  users: this.http.get('/api/users'),
  products: this.http.get('/api/products'),
  settings: this.http.get('/api/settings')
});
```

## Практические примеры

### 1. Автодополнение поиска

```typescript
@Component({
  selector: 'app-search',
  template: `
    <input [formControl]="searchControl">
    <div *ngIf="loading$ | async">Loading...</div>
    <div *ngFor="let result of results$ | async">
      {{ result.name }}
    </div>
  `
})
export class SearchComponent implements OnInit {
  searchControl = new FormControl('');
  loading$ = new BehaviorSubject<boolean>(false);
  
  results$ = this.searchControl.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    tap(() => this.loading$.next(true)),
    switchMap(term => this.searchService.search(term).pipe(
      catchError(() => of([])),
      finalize(() => this.loading$.next(false))
    )),
    shareReplay(1)
  );
}
```

### 2. Загрузка данных с повторными попытками

```typescript
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private retryStrategy = {
    maxRetries: 3,
    delayMs: 1000,
    backoffMultiplier: 2
  };

  loadData(): Observable<Data> {
    return this.http.get<Data>('/api/data').pipe(
      retryWhen(errors => 
        errors.pipe(
          scan((retryCount, error) => {
            if (retryCount >= this.retryStrategy.maxRetries) {
              throw error;
            }
            
            const delay = this.retryStrategy.delayMs * 
              Math.pow(this.retryStrategy.backoffMultiplier, retryCount);
            
            console.log(`Retry ${retryCount + 1} after ${delay}ms`);
            return retryCount + 1;
          }, 0),
          delay(this.retryStrategy.delayMs)
        )
      ),
      shareReplay(1)
    );
  }
}
```

### 3. Управление состоянием формы

```typescript
@Component({
  selector: 'app-form',
  template: `
    <form [formGroup]="form">
      <input formControlName="name">
      <input formControlName="email">
      <div *ngIf="errors$ | async as errors">
        {{ errors | json }}
      </div>
    </form>
  `
})
export class FormComponent implements OnInit {
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  errors$ = merge(
    this.form.get('name').statusChanges,
    this.form.get('email').statusChanges
  ).pipe(
    map(() => this.getFormErrors()),
    distinctUntilChanged((prev, curr) => 
      JSON.stringify(prev) === JSON.stringify(curr)
    ),
    shareReplay(1)
  );

  private getFormErrors() {
    const errors: any = {};
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }
}
```

## Обработка ошибок

### 1. Стратегии обработки ошибок

```typescript
// Перехват и замена значением по умолчанию
const safe$ = data$.pipe(
  catchError(error => {
    console.error('Error:', error);
    return of(defaultValue);
  })
);

// Повторные попытки
const retry$ = data$.pipe(
  retry(3),
  catchError(error => {
    console.error('Failed after 3 retries:', error);
    return throwError(() => error);
  })
);

// Пользовательская логика повторных попыток
const customRetry$ = data$.pipe(
  retryWhen(errors => 
    errors.pipe(
      scan((retryCount, error) => {
        if (retryCount >= 3) {
          throw error;
        }
        return retryCount + 1;
      }, 0),
      delay(1000)
    )
  )
);
```

### 2. Глобальная обработка ошибок

```typescript
@Injectable()
export class GlobalErrorHandler {
  handleError(error: Error) {
    const errorObservable = new Subject<Error>();
    
    errorObservable.pipe(
      // Группировка похожих ошибок
      groupBy(err => err.message),
      // Ограничение количества ошибок в единицу времени
      mergeMap(group => group.pipe(
        throttleTime(5000)
      )),
      // Логирование
      tap(err => {
        console.error('Global error:', err);
        // Отправка на сервер
        this.logError(err);
      })
    ).subscribe();

    errorObservable.next(error);
  }

  private logError(error: Error): Observable<void> {
    return this.http.post('/api/errors', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date()
    });
  }
}
```

## Оптимизация производительности

### 1. Кэширование результатов

```typescript
@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, Observable<any>>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 минут

  getData(key: string, fetcher: () => Observable<any>): Observable<any> {
    if (!this.cache.has(key)) {
      const timestamp = Date.now();
      
      this.cache.set(
        key,
        fetcher().pipe(
          map(data => ({
            data,
            timestamp
          })),
          shareReplay(1)
        )
      );
    }

    return this.cache.get(key).pipe(
      map(({ data, timestamp }) => {
        if (Date.now() - timestamp > this.CACHE_DURATION) {
          this.cache.delete(key);
          return this.getData(key, fetcher);
        }
        return data;
      })
    );
  }
}
```

### 2. Отмена неактуальных запросов

```typescript
@Injectable({
  providedIn: 'root'
})
export class OptimizedHttpService {
  private pendingRequests = new Map<string, Observable<any>>();

  request<T>(url: string): Observable<T> {
    const key = this.createCacheKey(url);

    if (!this.pendingRequests.has(key)) {
      this.pendingRequests.set(
        key,
        this.http.get<T>(url).pipe(
          shareReplay(1),
          finalize(() => this.pendingRequests.delete(key))
        )
      );
    }

    return this.pendingRequests.get(key);
  }

  private createCacheKey(url: string): string {
    return `${url}-${Date.now()}`;
  }
}
```

## Тестирование Observable

### 1. Использование TestScheduler

```typescript
import { TestScheduler } from 'rxjs/testing';

describe('Observable Tests', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should transform values correctly', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const source$ = cold('a-b-c|', { a: 1, b: 2, c: 3 });
      const expected = 'a-b-c|';
      const result$ = source$.pipe(
        map(x => x * 2)
      );

      expectObservable(result$).toBe(
        expected,
        { a: 2, b: 4, c: 6 }
      );
    });
  });
});
```

### 2. Тестирование асинхронных операций

```typescript
import { fakeAsync, tick } from '@angular/core/testing';

describe('Async Observable Tests', () => {
  it('should handle debounced input', fakeAsync(() => {
    const results: string[] = [];
    
    const input$ = new Subject<string>();
    const search$ = input$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    );

    search$.subscribe(value => results.push(value));

    // Имитация ввода
    input$.next('a');
    tick(100);
    input$.next('ab');
    tick(100);
    input$.next('abc');
    tick(300);

    expect(results).toEqual(['abc']);
  }));
});
```


---

# Декораторы в TypeScript

## 1. Декораторы классов
Декораторы классов позволяют изменять или дополнять поведение конструктора класса.

### Пример: Запечатывание класса (`sealed`)
```typescript
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class BankAccount {
  private balance: number = 0;

  deposit(amount: number) {
    this.balance += amount;
  }
}
```
- `Object.seal(constructor)` — запрещает добавление/удаление **статических** свойств.
- `Object.seal(constructor.prototype)` — запрещает изменения в экземплярах класса.

---

## 2. Декораторы свойств
Позволяют модифицировать свойства, например, добавлять валидацию.

### Пример: Обязательное поле (`required`)
```typescript
function required(target: any, propertyKey: string) {
  let value: any;
  
  const getter = () => value;
  const setter = (newValue: any) => {
    if (newValue === undefined || newValue === null) {
      throw new Error(`${propertyKey} is required`);
    }
    value = newValue;
  };

  Object.defineProperty(target, propertyKey, {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: true
  });
}

class User {
  @required
  name: string;
}
```
- Геттер возвращает значение.
- Сеттер проверяет, что `name` не `null` и не `undefined`, иначе выбрасывает ошибку.

---

## 3. Декораторы методов
Позволяют изменять логику методов.

### Пример: Логирование вызовов метода
```typescript
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`Метод ${propertyKey} вызван с аргументами:`, args);
    return originalMethod.apply(this, args);
  };
}

class MathOperations {
  @log
  add(a: number, b: number): number {
    return a + b;
  }
}

const math = new MathOperations();
math.add(2, 3); // Лог: Метод add вызван с аргументами: [2, 3]
```

---

## 4. Декораторы в Angular
В Angular декораторы используются для управления компонентами.

### Декоратор `@Input()`
Позволяет передавать данные в дочерний компонент.

```typescript
@Component({
  selector: 'app-child',
  template: `<p>Получено: {{ value }}</p>`
})
export class ChildComponent {
  @Input() value: string;
}
```
Использование в родительском компоненте:
```html
<app-child [value]="'Привет'"></app-child>
```

### Реализация `@Input()` вручную:
```typescript
function Input() {
  return function (target: any, propertyKey: string) {
    let value: any;

    Object.defineProperty(target, propertyKey, {
      get: () => value,
      set: (newValue) => {
        console.log(`Input ${propertyKey} обновлён:`, newValue);
        value = newValue;
      },
      enumerable: true,
      configurable: true
    });
  };
}

class ChildComponent {
  @Input()
  value: string;
}
```
Здесь:
- Декоратор `Input()` добавляет `get` и `set` к свойству.
- При изменении значения вызывается `console.log()`.
- Это **упрощённый аналог Angular Input**.

---

## Итог
- **Декораторы классов** изменяют конструктор.
- **Декораторы свойств** позволяют добавлять логику валидации.
- **Декораторы методов** изменяют поведение функций.
- **В Angular `@Input()` оборачивает свойство и подключает его к привязке данных.**


---

# TypeScript: Словари (Dictionary)

## Определение словаря в TypeScript

В TypeScript нет отдельного понятия "словарь" (Dictionary), как в Python или C#. Однако его аналогом является **объект с динамическими ключами**, который можно определить несколькими способами:

### 1. Индексная сигнатура

```typescript
interface Dictionary {
  [key: string]: string;
}

const translations: Dictionary = {
  hello: "Привет",
  world: "Мир",
};
```

📌 **Как работает?**  
- `Dictionary` описывает объект, у которого **любые строки могут быть ключами**, а значения — `string`.
- Если ключа нет, вернётся `undefined`.

---

### 2. Использование `Record<K, V>`

```typescript
const userRoles: Record<string, string> = {
  admin: "Администратор",
  user: "Пользователь",
};

console.log(userRoles["admin"]); // Администратор
```

📌 **Зачем использовать `Record`?**  
- `Record<K, V>` — это **универсальный способ** описания словарей.
- Гарантирует, что ключи и значения соответствуют указанным типам.

---

## Примеры реального использования

### 🔹 1. Кеширование данных API

```typescript
interface Cache {
  [key: string]: string;
}

const cache: Cache = {};

function fetchData(url: string): Promise<string> {
  if (cache[url]) {
    console.log("Берем из кэша:", cache[url]);
    return Promise.resolve(cache[url]);
  }

  return fetch(url)
    .then((res) => res.text())
    .then((data) => {
      cache[url] = data;
      return data;
    });
}
```

📌 **Как работает?**  
- Хранит данные в памяти, снижает нагрузку на сервер.

---

### 🔹 2. Подсчет частоты слов в тексте

```typescript
interface WordCount {
  [word: string]: number;
}

function countWords(text: string): WordCount {
  const words = text.split(" ");
  const frequency: WordCount = {};

  words.forEach((word) => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  return frequency;
}

console.log(countWords("яблоко банан яблоко апельсин банан банан"));
// { яблоко: 2, банан: 3, апельсин: 1 }
```

📌 **Зачем?** Полезно для анализа текстов, NLP и поиска.

---

### 🔹 3. Фильтрация запрещенных слов

```typescript
interface SpamWords {
  [word: string]: boolean;
}

const spamWords: SpamWords = {
  "бесплатно": true,
  "выигрыш": true,
  "кредит": true,
};

function isSpam(text: string): boolean {
  return text.split(" ").some((word) => spamWords[word.toLowerCase()]);
}

console.log(isSpam("Вы получили выигрыш!")); // true
console.log(isSpam("Как дела?")); // false
```

📌 **Зачем?** Используется в чат-ботах, комментариях и фильтрации контента.

---

### 🔹 4. Группировка элементов по категориям

```typescript
interface CategoryDictionary {
  [category: string]: string[];
}

const groupedItems: CategoryDictionary = {
  фрукты: ["яблоко", "банан"],
  овощи: ["картофель", "морковь"],
};

console.log(groupedItems["фрукты"]); // ["яблоко", "банан"]
```

📌 **Зачем?** Полезно для каталогов, интернет-магазинов.

---

### 🔹 5. Динамическое подключение плагинов

```typescript
interface Plugin {
  init: () => void;
}

interface PluginDictionary {
  [pluginName: string]: Plugin;
}

const plugins: PluginDictionary = {
  analytics: { init: () => console.log("Analytics загружен") },
  chat: { init: () => console.log("Chat загружен") },
};

function loadPlugin(name: string) {
  plugins[name]?.init();
}

loadPlugin("analytics"); // "Analytics загружен"
```

📌 **Зачем?** Позволяет загружать плагины динамически.

---

## Итог

### Когда использовать `Record<K, V>` vs. интерфейсы?

| Способ | Когда использовать? |
|--------|---------------------|
| `interface Dictionary { [key: string]: V }` | Когда нужна **индексная сигнатура** (гибкость в типах значений) |
| `Record<K, V>` | Когда нужны **фиксированные типы** ключей и значений |
| `interface FixedDictionary` | Когда **ключи заранее известны** |

📌 **Вывод**:  
Словари в TypeScript — это удобный способ хранения динамических данных. Они полезны в локализации, кешировании, группировке данных и динамическом управлении. Используйте `Record<K, V>` или `[key: string]: valueType`, в зависимости от задач.


---

# TypeScript: Generics и Ограничения

## Введение в Generics

Generics позволяют создавать универсальные функции, классы и интерфейсы, которые работают с различными типами данных, сохраняя при этом строгую типизацию.

```typescript
function identity<T>(arg: T): T {
    return arg;
}

const result = identity(5);       // result: number = 5
const resultString = identity("Hello"); // resultString: string = "Hello"
```

Здесь `T` — это параметр типа, который определяется во время вызова функции.

## Ограничения для Generics

Иногда необходимо ограничить тип `T`, чтобы он соответствовал определённому интерфейсу.

```typescript
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(arg: T): number {
  return arg.length;
}

// Работает:
logLength("hello");     // string имеет length
logLength([1, 2, 3]);  // массив имеет length

// Ошибка:
// logLength(123);     // number не имеет length
```

Здесь `T` должен иметь свойство `length`, что делает возможным безопасный вызов `arg.length`.

## Использование нескольких параметров Generics

```typescript
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const myPair = pair(5, "text"); // [5, "text"]
```

Здесь `T` и `U` — два независимых типа, что делает функцию ещё более универсальной.

## Generics в интерфейсах

```typescript
interface GenericResponse<T> {
  data: T;
  status: number;
  message: string;
}

const response: GenericResponse<string> = {
  data: "Success",
  status: 200,
  message: "OK"
};
```

## Generics в классах

```typescript
class Box<T> {
  constructor(private value: T) {}

  getValue(): T {
    return this.value;
  }
}

const numberBox = new Box(100);
const stringBox = new Box("Hello");

console.log(numberBox.getValue()); // 100
console.log(stringBox.getValue()); // Hello
```

## Итог

Generics в TypeScript позволяют писать гибкий и безопасный код, минимизируя дублирование и обеспечивая строгую типизацию.


---

# TypeScript: Кортежи и их применение

## 1. Что такое кортежи и зачем они нужны
Кортежи (`tuple`) в TypeScript — это структуры данных, которые фиксируют **количество и порядок элементов**. В отличие от обычных массивов, где можно хранить любое количество элементов, кортежи требуют **строгого соответствия типов по индексам**.

```typescript
let rgb: [number, number, number] = [255, 0, 0]; // Красный цвет
```

> ❌ **Ошибка:** `let broken: [number, number, number] = [255, 0]; // Недостаточно элементов!`

### Когда использовать кортежи:
- Когда **количество элементов фиксировано**.
- Когда **важен порядок данных** (например, координаты в пространстве).
- Когда **разные элементы имеют разные типы** (например, ID + имя пользователя).

---

## 2. Примеры реального использования кортежей

### 2.1. Координаты в 3D
Кортежи идеально подходят для хранения 3D-координат, так как у точки всегда **три оси: X, Y, Z**.

```typescript
type Vector3 = [number, number, number];

function addVectors(a: Vector3, b: Vector3): Vector3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

const pointA: Vector3 = [1, 2, 3];
const pointB: Vector3 = [4, 5, 6];

const result = addVectors(pointA, pointB);
console.log(result); // [5, 7, 9]
```

📌 **Преимущества:** Компактный и строгий формат, гарантирующий правильную работу с координатами.

---

### 2.2. RGB Цвета
RGB-цвета всегда состоят из **трёх чисел**, поэтому кортеж здесь логичен.

```typescript
type RGB = [number, number, number];

const red: RGB = [255, 0, 0];   // Красный
const green: RGB = [0, 255, 0]; // Зелёный
const blue: RGB = [0, 0, 255];  // Синий
```

📌 **Преимущества:** Гарантия, что цвет всегда состоит из трёх значений.

---

### 2.3. Данные из базы в PostgreSQL
В PostgreSQL можно использовать кортежи для выборки данных по нескольким параметрам.

В **TypeScript + Node.js (pg)** кортежи помогают передавать такие параметры в запрос.

```typescript
import { Client } from "pg";

const client = new Client({
  user: "your_user",
  host: "localhost",
  database: "your_db",
  password: "your_password",
  port: 5432,
});

async function fetchUsersByStatus() {
  await client.connect();

  // Кортежи для запроса
  const statuses: [string, string][] = [
    ["active", "admin"],
    ["inactive", "user"]
  ];

  const query = `
    SELECT * FROM users 
    WHERE (status, role) IN (${statuses.map(() => "(?, ?)").join(", ")})
  `;

  const flatParams = statuses.flat(); // Преобразуем в плоский массив
  const res = await client.query(query, flatParams);

  console.log(res.rows);
  await client.end();
}

fetchUsersByStatus();
```

📌 **Преимущества:** 
- Удобная работа с **парными значениями**.
- **Оптимизация SQL-запросов** за счёт использования `IN (...)`.

---

### 2.4. Кортежи в React (useState)
React-хуки возвращают **кортеж** `[значение, функция для изменения]`.

```tsx
const [count, setCount] = useState<number>(0);
```

📌 **Преимущества:** 
- Удобно деструктурировать результат.
- Гарантия, что первый элемент — **значение**, а второй — **функция**.

---

### 2.5. Гибкие кортежи с переменной длиной
Если надо **фиксированное начало**, но **произвольное количество элементов дальше**, можно использовать **оставшиеся элементы (`...rest`)**:

```typescript
type AtLeastTwoNumbers = [number, number, ...number[]];

const example1: AtLeastTwoNumbers = [1, 2];       // ✅ Окей
const example2: AtLeastTwoNumbers = [1, 2, 3, 4]; // ✅ Окей
const example3: AtLeastTwoNumbers = [1];          // ❌ Ошибка
```

📌 **Преимущества:** 
- Можно задать **обязательные** элементы, но оставить возможность добавлять другие.

---

## 3. Вывод
Кортежи в TypeScript помогают **гарантировать структуру данных** там, где **обычные массивы были бы слишком гибкими**. Они особенно полезны для:
- **Графики и 3D-объектов** (`[x, y, z]`, `[r, g, b]`).
- **Оптимизации работы с базами данных**.
- **React-хуков (`useState`)**.
- **Работы с API и неизменяемыми данными**.

Если важно **гарантировать количество и порядок значений**, **используй кортежи**! 🚀


---


ИТОГОВАЯ МЕТОДИКА ПРОВЕДЕНИЯ ВОСЬМОГО МОДУЛЯ КУРСА ПО ANGULAR 
(Продвинутые темы TypeScript и RxJS)

1. Типы данных и типизация в TypeScript
- Примитивные типы данных: number, string, boolean, null, undefined.
- Подробное понимание и практическое обсуждение записи чисел в разных системах (десятичная, шестнадцатеричная, бинарная, восьмеричная).
- Массивы и кортежи, строгая типизация структуры данных.

2. Интерфейсы, классы и декораторы
- Использование интерфейсов и классов в TypeScript.
- Практическое применение декораторов для классов, свойств и методов.
- Angular-декораторы (например, @Input) и их реализация.

3. Дженерики (Generics)
- Применение дженериков для создания универсальных функций и классов.
- Ограничения Generics (extends, ограничения по интерфейсам).
- Практические примеры использования в интерфейсах и классах.

4. RxJS и реактивное программирование
- Глубокое понимание Observable, Subject, BehaviorSubject.
- Операторы RxJS: map, filter, mergeMap, debounceTime, combineLatest.
- Создание и подписка на Observable-потоки (from, of, fromEvent).
- Примеры асинхронных операций и оптимизации производительности (автодополнение, кэширование).

5. TypeScript Dictionaries (словари)
- Индексные сигнатуры и использование Record<K, V>.
- Практическое применение словарей в реальных проектах (кеширование, фильтрация данных).

6. Кортежи в TypeScript
- Строгая структура и фиксированный порядок элементов.
- Реальные примеры использования кортежей (3D-координаты, цвета RGB, работа с базами данных).

ДОПОЛНИТЕЛЬНЫЕ ДОСМЫСЛЕНИЯ И УЛУЧШЕНИЯ В ПРОЦЕССЕ ЗАНЯТИЯ:

7. Углубленное понимание типов данных:
- Практическое понимание различий форм записи чисел и их типизации.
- Обсуждение строгой типизации и возможностей более детализированной проверки типов данных.

8. Практическое осмысление подходов к типизации:
- Четкое понимание, что различия между системами записи (десятичной, шестнадцатеричной и др.) касаются только читаемости кода, а не представления данных в памяти.

ИТОГОВАЯ РАСШИРЕННАЯ СТРУКТУРА ВОСЬМОГО МОДУЛЯ:

1. Типы данных TypeScript:
   - Примитивы, массивы, кортежи.
   - Практическая типизация данных.

2. Классы, интерфейсы и декораторы:
   - Практическое применение, Angular-декораторы.

3. Дженерики:
   - Создание универсальных решений.
   - Ограничения и практическое применение.

4. RxJS:
   - Реактивные подходы и операторы.
   - Практическое создание потоков.

5. Словари:
   - Использование и практические примеры.

6. Кортежи:
   - Структура и примеры использования.

7. Дополнительные уточнения:
   - Глубокое обсуждение типизации чисел.
   - Практическое понимание строгой типизации.

Эта методика позволит студентам получить глубокое понимание продвинутых возможностей TypeScript и RxJS, научиться эффективно использовать эти знания в Angular-проектах, повысить качество и эффективность кода за счет строгой типизации и реактивного подхода.


---

