# Введение в сервисы: Объяснение концепции сервисов для хранения данных и общей логики

## Что такое сервисы в Angular?

**Сервисы** в Angular — это классы, предназначенные для организации и совместного использования бизнес-логики, данных и функций между различными компонентами приложения. Они являются фундаментальной концепцией в Angular и следуют принципу единой ответственности (Single Responsibility Principle).

### Основные характеристики сервисов:

- **Переиспользуемость** — код, который можно использовать в разных частях приложения
- **Независимость от компонентов** — отделение бизнес-логики от представления
- **Централизованное хранение данных** — единый источник истины для данных
- **Взаимодействие с внешними ресурсами** — API, локальное хранилище и т.д.

## Создание сервиса через Angular CLI

Для создания нового сервиса используется команда Angular CLI:

```bash
ng generate service my-service
# или сокращенно
ng g s my-service
```

Эта команда создаст два файла:
- `my-service.service.ts` — файл с классом сервиса
- `my-service.service.spec.ts` — файл для unit-тестов

### Структура простого сервиса:

```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MyService {
  constructor() { }
  
  getData() {
    return 'Some data from service';
  }
}
```

## Основные сценарии использования сервисов

### 1. Управление данными
- Хранение состояния приложения
- CRUD операции
- Кэширование данных

```typescript
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];

  getUsers(): User[] {
    return this.users;
  }

  addUser(user: User): void {
    this.users.push(user);
  }
}
```

### 2. HTTP-запросы
- Взаимодействие с REST API
- Обработка ответов
- Обработка ошибок

```typescript
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    return this.http.get('api/endpoint');
  }
}
```

### 3. Общая бизнес-логика
- Валидация данных
- Форматирование
- Вычисления

```typescript
@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  formatDate(date: Date): string {
    return date.toLocaleDateString();
  }

  calculateTotal(items: Item[]): number {
    return items.reduce((sum, item) => sum + item.price, 0);
  }
}
```

## Лучшие практики при работе с сервисами

1. **Принцип единой ответственности**
   - Каждый сервис должен отвечать за одну конкретную функциональность
   - Избегайте создания "сервисов-монстров"

2. **Именование**
   - Используйте суффикс "Service"
   - Имя должно отражать назначение сервиса

3. **Документация**
   - Добавляйте JSDoc комментарии
   - Описывайте параметры и возвращаемые значения

4. **Обработка ошибок**
   - Предусматривайте обработку исключительных ситуаций
   - Используйте типизацию для предотвращения ошибок

5. **Тестирование**
   - Пишите unit-тесты для сервисов
   - Используйте моки для внешних зависимостей

## Практический пример

```typescript
@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todos: Todo[] = [];

  getTodos(): Todo[] {
    return [...this.todos]; // Возвращаем копию массива
  }

  addTodo(title: string): void {
    const todo: Todo = {
      id: Date.now(),
      title,
      completed: false
    };
    this.todos.push(todo);
  }

  toggleTodo(id: number): void {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
  }

  deleteTodo(id: number): void {
    this.todos = this.todos.filter(t => t.id !== id);
  }
}
```

Этот пример демонстрирует сервис для управления списком задач, который можно использовать в различных компонентах приложения.


---

# Dependency Injection: Как Angular управляет зависимостями

## Что такое Dependency Injection?

**Dependency Injection (DI)** — это паттерн проектирования, в котором класс запрашивает зависимости от внешних источников вместо их создания самостоятельно. В Angular DI является ключевым механизмом, который позволяет компонентам и сервисам получать свои зависимости.

### Преимущества DI:
- **Уменьшение связанности кода**
- **Улучшение тестируемости**
- **Гибкость в замене реализаций**
- **Повторное использование компонентов**

## Как работает DI в Angular?

### 1. Инжектор (Injector)

Инжектор — это механизм, который Angular использует для управления зависимостями:

```typescript
@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  log(message: string) {
    console.log(message);
  }
}

@Component({
  selector: 'app-example',
  template: '<div>Example Component</div>'
})
export class ExampleComponent {
  constructor(private logger: LoggerService) {
    // Angular автоматически внедряет экземпляр LoggerService
  }
}
```

### 2. Провайдеры (Providers)

Провайдеры указывают Angular, как создавать или получать экземпляры зависимостей:

```typescript
@NgModule({
  providers: [
    LoggerService,
    { provide: API_URL, useValue: 'http://api.example.com' },
    { provide: DataService, useClass: MockDataService },
    { 
      provide: ConfigService,
      useFactory: (http: HttpClient) => new ConfigService(http),
      deps: [HttpClient]
    }
  ]
})
```

## Область видимости сервисов (Service Scope)

### 1. Root-level scope

```typescript
@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  // Один экземпляр на все приложение
}
```

### 2. Module-level scope

```typescript
@NgModule({
  providers: [ModuleLevelService]
})
export class FeatureModule { }
```

### 3. Component-level scope

```typescript
@Component({
  selector: 'app-feature',
  providers: [ComponentLevelService]
})
export class FeatureComponent { }
```

## Токены внедрения (Injection Tokens)

Токены используются для идентификации зависимостей:

```typescript
import { InjectionToken } from '@angular/core';

export const API_URL = new InjectionToken<string>('api.url');

@NgModule({
  providers: [
    { provide: API_URL, useValue: 'http://api.example.com' }
  ]
})
export class AppModule { }

@Injectable()
export class ApiService {
  constructor(@Inject(API_URL) private apiUrl: string) { }
}
```

## Иерархия инжекторов

Angular использует иерархическую систему инжекторов:

1. **Платформенный инжектор** (Platform Injector)
2. **Корневой инжектор** (Root Injector)
3. **Инжекторы модулей** (NgModule Injectors)
4. **Инжекторы компонентов** (Component Injectors)

```typescript
@Component({
  selector: 'parent',
  providers: [{ provide: DataService, useClass: ParentDataService }]
})
class ParentComponent {
  constructor(private data: DataService) {} // Получает ParentDataService
}

@Component({
  selector: 'child',
  providers: [{ provide: DataService, useClass: ChildDataService }]
})
class ChildComponent {
  constructor(private data: DataService) {} // Получает ChildDataService
}
```

## Продвинутые концепции DI

### 1. Optional Dependencies

```typescript
@Component({
  selector: 'app-example'
})
export class ExampleComponent {
  constructor(@Optional() private logger: LoggerService) {
    // Сервис может быть null
  }
}
```

### 2. Self и SkipSelf декораторы

```typescript
@Component({
  selector: 'app-example',
  providers: [DataService]
})
export class ExampleComponent {
  constructor(
    @Self() private selfData: DataService,
    @SkipSelf() private parentData: DataService
  ) { }
}
```

### 3. Multi Providers

```typescript
export abstract class LoggerService {
  abstract log(message: string): void;
}

@Injectable()
export class ConsoleLogger implements LoggerService {
  log(message: string) {
    console.log(message);
  }
}

@Injectable()
export class FileLogger implements LoggerService {
  log(message: string) {
    // Логирование в файл
  }
}

@NgModule({
  providers: [
    { provide: LoggerService, useClass: ConsoleLogger, multi: true },
    { provide: LoggerService, useClass: FileLogger, multi: true }
  ]
})
export class AppModule { }
```

## Лучшие практики

1. **Используйте providedIn: 'root'** для сервисов, которые должны быть синглтонами

```typescript
@Injectable({
  providedIn: 'root'
})
export class SingletonService { }
```

2. **Правильно определяйте область видимости** сервисов

3. **Используйте интерфейсы** для лучшей абстракции

```typescript
interface IUserService {
  getUsers(): Observable<User[]>;
}

@Injectable({
  providedIn: 'root'
})
class UserService implements IUserService {
  getUsers(): Observable<User[]> {
    // Реализация
  }
}
```

4. **Избегайте циклических зависимостей**

5. **Используйте фабрики** для сложной инициализации

```typescript
export function configServiceFactory(http: HttpClient) {
  return new ConfigService(http, process.env.API_URL);
}

@NgModule({
  providers: [
    {
      provide: ConfigService,
      useFactory: configServiceFactory,
      deps: [HttpClient]
    }
  ]
})
export class AppModule { }
```


---

# Взаимодействие компонентов через сервисы: Обмен данными между компонентами

## Введение

Взаимодействие между компонентами через сервисы — это мощный паттерн в Angular, который позволяет организовать обмен данными между компонентами, не связанными напрямую через иерархию родитель-потомок. Этот подход обеспечивает слабую связанность компонентов и улучшает поддерживаемость кода.

## Основные способы взаимодействия

### 1. Использование Observable

```typescript
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private messageSource = new BehaviorSubject<string>('');
  currentMessage = this.messageSource.asObservable();

  changeMessage(message: string) {
    this.messageSource.next(message);
  }
}

@Component({
  selector: 'app-sender'
})
export class SenderComponent {
  constructor(private data: DataService) {}

  sendMessage() {
    this.data.changeMessage('Hello from Sender');
  }
}

@Component({
  selector: 'app-receiver'
})
export class ReceiverComponent implements OnInit {
  message: string = '';

  constructor(private data: DataService) {}

  ngOnInit() {
    this.data.currentMessage.subscribe(message => {
      this.message = message;
    });
  }
}
```

### 2. Состояние приложения (State Management)

```typescript
interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private state = new BehaviorSubject<AppState>({
    user: null,
    isAuthenticated: false,
    theme: 'light'
  });

  getState() {
    return this.state.asObservable();
  }

  updateState(newState: Partial<AppState>) {
    this.state.next({
      ...this.state.value,
      ...newState
    });
  }
}
```

## Паттерны взаимодействия

### 1. Публикация/Подписка (Pub/Sub)

```typescript
@Injectable({
  providedIn: 'root'
})
export class EventService {
  private events = new Subject<any>();

  emit(event: any) {
    this.events.next(event);
  }

  listen(): Observable<any> {
    return this.events.asObservable();
  }
}
```

### 2. Хранилище данных (Store)

```typescript
@Injectable({
  providedIn: 'root'
})
export class TodoStore {
  private todos: Todo[] = [];
  private todosSubject = new BehaviorSubject<Todo[]>([]);

  getTodos(): Observable<Todo[]> {
    return this.todosSubject.asObservable();
  }

  addTodo(todo: Todo) {
    this.todos = [...this.todos, todo];
    this.todosSubject.next(this.todos);
  }

  removeTodo(id: number) {
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.todosSubject.next(this.todos);
  }
}
```

## Практические примеры

### 1. Корзина покупок

```typescript
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items = new BehaviorSubject<CartItem[]>([]);
  private total = new BehaviorSubject<number>(0);

  getItems() {
    return this.items.asObservable();
  }

  getTotal() {
    return this.total.asObservable();
  }

  addItem(item: CartItem) {
    const currentItems = this.items.value;
    const existingItem = currentItems.find(i => i.id === item.id);

    if (existingItem) {
      existingItem.quantity += 1;
      this.items.next([...currentItems]);
    } else {
      this.items.next([...currentItems, { ...item, quantity: 1 }]);
    }

    this.updateTotal();
  }

  private updateTotal() {
    const total = this.items.value.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
    this.total.next(total);
  }
}
```

### 2. Аутентификация

```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user = new BehaviorSubject<User | null>(null);
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  getUser() {
    return this.user.asObservable();
  }

  getAuthStatus() {
    return this.isAuthenticated.asObservable();
  }

  login(credentials: { username: string; password: string }) {
    // API запрос на аутентификацию
    return this.http.post<User>('/api/login', credentials).pipe(
      tap(user => {
        this.user.next(user);
        this.isAuthenticated.next(true);
      })
    );
  }

  logout() {
    this.user.next(null);
    this.isAuthenticated.next(false);
  }
}
```

## Лучшие практики

1. **Использование типизации**
   ```typescript
   export interface Message<T> {
     type: string;
     payload: T;
   }

   export class MessageService {
     private messages = new Subject<Message<any>>();

     send<T>(message: Message<T>) {
       this.messages.next(message);
     }

     on<T>(type: string): Observable<T> {
       return this.messages.pipe(
         filter(msg => msg.type === type),
         map(msg => msg.payload)
       );
     }
   }
   ```

2. **Отписка от Observable**
   ```typescript
   export class MyComponent implements OnInit, OnDestroy {
     private destroy$ = new Subject<void>();

     ngOnInit() {
       this.dataService.getData()
         .pipe(takeUntil(this.destroy$))
         .subscribe(data => {
           // Обработка данных
         });
     }

     ngOnDestroy() {
       this.destroy$.next();
       this.destroy$.complete();
     }
   }
   ```

3. **Кэширование данных**
   ```typescript
   export class CacheService {
     private cache = new Map<string, any>();
     private cacheTime = new Map<string, number>();
     private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 минут

     getData(key: string): any {
       const time = this.cacheTime.get(key);
       if (time && Date.now() - time < this.CACHE_DURATION) {
         return this.cache.get(key);
       }
       return null;
     }

     setData(key: string, data: any): void {
       this.cache.set(key, data);
       this.cacheTime.set(key, Date.now());
     }
   }
   ```

4. **Обработка ошибок**
   ```typescript
   export class ErrorHandlingService {
     private errors = new Subject<string>();

     getErrors(): Observable<string> {
       return this.errors.asObservable();
     }

     handleError(error: any) {
       const message = error.message || 'Произошла ошибка';
       this.errors.next(message);
     }
   }
   ```


---


ИТОГОВАЯ МЕТОДИКА ПРОВЕДЕНИЯ ТРЕТЬЕГО МОДУЛЯ КУРСА ПО ANGULAR (Сервисы, Dependency Injection и Взаимодействие компонентов)

1. Введение в сервисы в Angular
- Концепция сервисов, их роль и практическое применение.
- Создание и организация сервисов (CLI команды, структура кода, best practices).
- Практические примеры сервисов для управления данными, HTTP-запросов и общей бизнес-логики.

2. Dependency Injection (DI) в Angular
- Подробное объяснение принципов работы DI (Инжекторы, Провайдеры, Injection Tokens).
- Практическое применение различных областей видимости сервисов:
  - Root-level scope (providedIn: 'root')
  - Module-level scope
  - Component-level scope
- Продвинутые концепции:
  - Optional dependencies, Self, SkipSelf
  - Multi Providers
- Лучшие практики внедрения зависимостей и предотвращение циклических зависимостей.

3. Взаимодействие компонентов через сервисы
- Обзор паттернов взаимодействия (Observable, State Management, Pub/Sub, Store).
- Практические примеры (Корзина покупок, Аутентификация, Управление состоянием).
- Рекомендации по работе с Observable (отписка от подписок, takeUntil).

ДОПОЛНИТЕЛЬНЫЕ ДОСМЫСЛЕНИЯ И УЛУЧШЕНИЯ, ВЫЯВЛЕННЫЕ В ПРОЦЕССЕ ЗАНЯТИЯ:

4. Уточнение сценариев использования RxJS:
- RxJS применять для сложных асинхронных сценариев, потоков данных и множественных источников (веб-сокеты, сенсоры).
- CRUD-запросы рекомендуется реализовывать через Promise.
- Практическая демонстрация на примерах и обсуждение критериев выбора RxJS или Promise.

5. Практическое применение и углубленный разбор Dependency Injection:
- Глубокое понимание областей видимости (root, module, component).
- Использование Injection Tokens для конфигураций.
- Применение Multi Providers для гибкости сервисов и зависимостей.
- Демонстрация @Self, @SkipSelf, @Optional декораторов в практических кейсах.

6. Организация обмена данными между компонентами через сервисы:
- Практическое рассмотрение передачи данных через Observable.
- Пример реализации на реальном кейсе (Todo-компоненты): использование сервиса для централизованного управления состоянием и обновления интерфейса.
- Лучшие практики организации подписок и предотвращения утечек памяти (takeUntil, unsubscribe).

ИТОГОВАЯ РАСШИРЕННАЯ СТРУКТУРА ТРЕТЬЕГО МОДУЛЯ:

1. Сервисы в Angular:
   - Создание, структура и организация.
   - Практическое применение (данные, HTTP, бизнес-логика).

2. Dependency Injection:
   - Принципы DI, Инжекторы и провайдеры.
   - Injection Tokens и Multi Providers.
   - Продвинутые концепции и лучшие практики.

3. Взаимодействие компонентов:
   - Паттерны взаимодействия (Observable, State Management).
   - Реализация на практике и рекомендации.

4. RxJS:
   - Четкие сценарии использования.
   - Сравнение с Promises.

5. Углубленный разбор Dependency Injection:
   - Практические демонстрации и глубокое понимание.

6. Обмен данными через сервисы:
   - Практические примеры и демонстрации.
   - Рекомендации по управлению подписками.

Эта итоговая методика поможет студентам получить глубокое понимание концепций и практических навыков работы с сервисами, DI и компонентами в Angular, а также поможет избежать распространенных ошибок и оптимизировать разработку приложений.
