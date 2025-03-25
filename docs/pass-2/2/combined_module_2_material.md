# Компоненты в Angular

## Создание компонентов с помощью Angular CLI

Angular CLI предоставляет удобный способ создания компонентов через команду:

```bash
ng generate component имя-компонента
# или сокращенно
ng g c имя-компонента
```

При выполнении этой команды Angular CLI автоматически создает:
- Файл с логикой компонента (*.component.ts)
- Файл с шаблоном (*.component.html)
- Файл со стилями (*.component.css/scss)
- Файл с тестами (*.component.spec.ts)

## Структура компонента

### 1. Шаблоны (HTML)
- Определяют структуру и содержание компонента
- Поддерживают привязку данных (data binding):
  - `{{ выражение }}` - интерполяция
  - `[свойство]="значение"` - привязка свойств
  - `(событие)="обработчик()"` - привязка событий
  - `[(ngModel)]="свойство"` - двусторонняя привязка

### 2. Стили (CSS/SCSS)
- Инкапсулированы в рамках компонента
- Можно использовать как CSS, так и SCSS
- Стили можно определять:
  - В отдельном файле
  - Inline через свойство styles
  - В теге `<style>` в шаблоне

### 3. Логика (TypeScript)
```typescript
@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent {
  // Свойства компонента
  // Методы
  // Логика
}
```

## Жизненный цикл компонентов

Angular предоставляет набор хуков жизненного цикла, которые выполняются в следующем порядке:

1. **constructor**
   - Не является хуком жизненного цикла, но важен для инициализации
   - Вызывается при создании компонента
   - Используется для внедрения зависимостей
   ```typescript
   constructor(
     private service: MyService,
     private router: Router
   ) {
     // Внедрение зависимостей
   }
   ```

2. **ngOnChanges**
   - Вызывается при изменении входных свойств (@Input)
   - Первый хук жизненного цикла
   - Получает объект SimpleChanges с предыдущими и текущими значениями
   ```typescript
   ngOnChanges(changes: SimpleChanges) {
     if (changes['myInput']) {
       console.log(
         'Предыдущее значение:', changes['myInput'].previousValue,
         'Текущее значение:', changes['myInput'].currentValue
       );
     }
   }
   ```

3. **ngOnInit**
   - Вызывается после первой инициализации компонента
   - Идеальное место для начальной настройки
   - Выполняется только один раз
   ```typescript
   ngOnInit() {
     // Загрузка данных
     this.loadInitialData();
     // Подписка на события
     this.subscription = this.service.events$.subscribe();
   }
   ```

4. **ngDoCheck**
   - Вызывается при каждой проверке изменений
   - Используется для ручной проверки
   - Срабатывает часто, поэтому нужно использовать аккуратно
   ```typescript
   interface Item {
     id: number;
     name: string;
   }

   @Component({
     selector: 'app-items-list',
     template: `
       <div *ngFor="let item of items">
         {{ item.name }}
       </div>
     `
   })
   export class ItemsListComponent implements DoCheck {
     @Input() items: Item[] = [];
     private previousItems: string = '';

     ngDoCheck() {
       // Преобразуем текущий массив в строку для сравнения
       const currentItems = JSON.stringify(this.items);
       
       // Если предыдущее состояние отличается от текущего
       if (this.previousItems !== currentItems) {
         console.log('Обнаружены изменения в массиве items');
         console.log('Было:', JSON.parse(this.previousItems || '[]'));
         console.log('Стало:', this.items);
         
         // Сохраняем текущее состояние
         this.previousItems = currentItems;
       }
     }
   }
   ```

5. **ngAfterContentInit**
   - Вызывается после инициализации контента (ng-content)
   - Выполняется один раз после ngDoCheck
   - Используется для работы с проецируемым контентом
   ```typescript
   @ContentChild(ChildComponent) child!: ChildComponent;
   
   ngAfterContentInit() {
     // Теперь у нас есть доступ к проецируемому контенту
     console.log('Проецируемый компонент:', this.child);
   }
   ```

6. **ngAfterContentChecked**
   - Вызывается после каждой проверки проецируемого контента
   - Выполняется после ngAfterContentInit и каждого ngDoCheck
   ```typescript
   ngAfterContentChecked() {
     // Проверка изменений в проецируемом контенте
     if (this.child && this.child.hasChanges) {
       this.handleChildChanges();
     }
   }
   ```

7. **ngAfterViewInit**
   - Вызывается после инициализации представления компонента и его дочерних элементов
   - Идеально для работы с DOM элементами
   ```typescript
   @ViewChild('myElement') element!: ElementRef;
   
   ngAfterViewInit() {
     // Теперь у нас есть доступ к DOM элементу
     console.log('DOM элемент:', this.element.nativeElement);
   }
   ```

8. **ngAfterViewChecked**
   - Вызывается после каждой проверки представления
   - Выполняется после ngAfterViewInit и каждой проверки представления
   ```typescript
   ngAfterViewChecked() {
     // Проверка изменений в представлении
     if (this.element.nativeElement.offsetHeight !== this.lastHeight) {
       this.lastHeight = this.element.nativeElement.offsetHeight;
       this.handleHeightChange();
     }
   }
   ```

9. **ngOnDestroy**
   - Вызывается перед уничтожением компонента
   - Используется для очистки ресурсов
   - Отписка от всех подписок
   ```typescript
   ngOnDestroy() {
     // Отписка от всех подписок
     this.subscription.unsubscribe();
     // Очистка таймеров
     clearInterval(this.timer);
     // Удаление обработчиков событий
     this.cleanup();
   }
   ```

Пример использования нескольких хуков в одном компоненте:

```typescript
@Component({
  selector: 'app-lifecycle-demo',
  template: `
    <div>
      <ng-content></ng-content>
      <div #viewChild>Дочерний элемент</div>
    </div>
  `
})
export class LifecycleDemoComponent implements 
    OnChanges, OnInit, DoCheck, 
    AfterContentInit, AfterContentChecked,
    AfterViewInit, AfterViewChecked, OnDestroy {
  
  @Input() data: any;
  @ViewChild('viewChild') viewChild!: ElementRef;
  @ContentChild('contentChild') contentChild!: ElementRef;
  
  constructor() {
    console.log('1. Constructor');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('2. OnChanges:', changes);
  }

  ngOnInit() {
    console.log('3. OnInit');
  }

  ngDoCheck() {
    console.log('4. DoCheck');
  }

  ngAfterContentInit() {
    console.log('5. AfterContentInit');
    console.log('ContentChild:', this.contentChild);
  }

  ngAfterContentChecked() {
    console.log('6. AfterContentChecked');
  }

  ngAfterViewInit() {
    console.log('7. AfterViewInit');
    console.log('ViewChild:', this.viewChild);
  }

  ngAfterViewChecked() {
    console.log('8. AfterViewChecked');
  }

  ngOnDestroy() {
    console.log('9. OnDestroy');
  }
}
```

Важные замечания по использованию хуков:
1. Не все хуки нужны в каждом компоненте
2. Имплементируйте только те интерфейсы, которые реально используете
3. Следите за производительностью в хуках, которые вызываются часто (ngDoCheck, ngAfterViewChecked, ngAfterContentChecked)
4. Всегда очищайте ресурсы в ngOnDestroy
5. Не изменяйте состояние компонента в ngAfterViewInit и ngAfterViewChecked

## Лучшие практики

1. Придерживайтесь принципа единой ответственности
2. Используйте декораторы для конфигурации
3. Правильно обрабатывайте жизненный цикл
4. Отписывайтесь от подписок в ngOnDestroy
5. Используйте Input() и Output() для коммуникации между компонентами

---

# Директивы в Angular

Директивы - это классы, которые добавляют дополнительное поведение элементам в приложениях Angular. 
В Angular есть три типа директив:
1. Компонентные директивы (Components)
2. Структурные директивы (Structural directives)
3. Атрибутивные директивы (Attribute directives)

## Структурные директивы

Структурные директивы изменяют структуру DOM, добавляя и удаляя элементы. Они всегда начинаются с символа `*`.

### 1. *ngIf

Условно отображает элемент на основе выражения.

```typescript
@Component({
  selector: 'app-if-demo',
  template: `
    <div *ngIf="isVisible">Этот текст будет виден</div>
    
    <!-- С else блоком -->
    <div *ngIf="isVisible; else notVisible">
      Контент виден
    </div>
    <ng-template #notVisible>
      Контент скрыт
    </ng-template>

    <!-- С then и else блоками -->
    <div *ngIf="isVisible; then visibleBlock else hiddenBlock"></div>
    <ng-template #visibleBlock>
      Блок для true
    </ng-template>
    <ng-template #hiddenBlock>
      Блок для false
    </ng-template>
  `
})
export class IfDemoComponent {
  isVisible = true;
}
```

### 2. *ngFor

Создает копию элемента для каждого элемента в массиве.

```typescript
@Component({
  selector: 'app-for-demo',
  template: `
    <!-- Базовое использование -->
    <div *ngFor="let item of items">
      {{ item.name }}
    </div>

    <!-- С дополнительными переменными -->
    <div *ngFor="let item of items; 
                 index as i; 
                 first as isFirst;
                 last as isLast;
                 even as isEven;
                 odd as isOdd">
      {{ i + 1 }}. {{ item.name }}
      <span *ngIf="isFirst">Первый элемент</span>
      <span *ngIf="isLast">Последний элемент</span>
      <span *ngIf="isEven">Четный</span>
      <span *ngIf="isOdd">Нечетный</span>
    </div>

    <!-- С отслеживанием изменений -->
    <div *ngFor="let item of items; trackBy: trackByFn">
      {{ item.name }}
    </div>
  `
})
export class ForDemoComponent {
  items = [
    { id: 1, name: 'Элемент 1' },
    { id: 2, name: 'Элемент 2' }
  ];

  trackByFn(index: number, item: any): number {
    return item.id; // Улучшает производительность при изменении массива
  }
}
```

### 3. *ngSwitch

Переключает между альтернативными элементами на основе условия.

```typescript
@Component({
  selector: 'app-switch-demo',
  template: `
    <div [ngSwitch]="color">
      <div *ngSwitchCase="'red'">Красный</div>
      <div *ngSwitchCase="'green'">Зеленый</div>
      <div *ngSwitchCase="'blue'">Синий</div>
      <div *ngSwitchDefault>Цвет не выбран</div>
    </div>
  `
})
export class SwitchDemoComponent {
  color = 'red';
}
```

## Атрибутивные директивы

Атрибутивные директивы изменяют внешний вид или поведение элемента.

### 1. ngClass

Динамически добавляет или удаляет CSS классы.

```typescript
@Component({
  selector: 'app-class-demo',
  template: `
    <!-- Объект -->
    <div [ngClass]="{'active': isActive, 
                     'disabled': isDisabled,
                     'highlight': isHighlighted}">
      Текст с классами
    </div>

    <!-- Массив -->
    <div [ngClass]="['class1', 'class2']">
      Текст с классами
    </div>

    <!-- Строка -->
    <div [ngClass]="'class1 class2'">
      Текст с классами
    </div>
  `,
  styles: [`
    .active { font-weight: bold; }
    .disabled { opacity: 0.5; }
    .highlight { background-color: yellow; }
  `]
})
export class ClassDemoComponent {
  isActive = true;
  isDisabled = false;
  isHighlighted = true;
}
```

### 2. ngStyle

Динамически устанавливает inline стили.

```typescript
@Component({
  selector: 'app-style-demo',
  template: `
    <div [ngStyle]="{
      'color': textColor,
      'font-size.px': fontSize,
      'background-color': isActive ? 'yellow' : 'white'
    }">
      Текст со стилями
    </div>
  `
})
export class StyleDemoComponent {
  textColor = 'blue';
  fontSize = 16;
  isActive = true;
}
```

### 3. Создание собственных директив

#### Простая директива подсветки

```typescript
// highlight.directive.ts
@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  @Input('appHighlight') highlightColor = 'yellow';
  
  constructor(private el: ElementRef) {}
  
  @HostListener('mouseenter')
  onMouseEnter() {
    this.highlight(this.highlightColor);
  }
  
  @HostListener('mouseleave')
  onMouseLeave() {
    this.highlight(null);
  }
  
  private highlight(color: string | null) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}

// Использование
@Component({
  selector: 'app-root',
  template: `
    <p appHighlight="lightblue">
      Наведите курсор для подсветки
    </p>
  `
})
```

#### Структурная директива

```typescript
// unless.directive.ts
@Directive({
  selector: '[appUnless]'
})
export class UnlessDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input() set appUnless(condition: boolean) {
    if (!condition && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (condition && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}

// Использование
@Component({
  selector: 'app-root',
  template: `
    <div *appUnless="condition">
      Показывается когда condition = false
    </div>
  `
})
```

#### Директива с валидацией форм

```typescript
// positive-number.directive.ts
@Directive({
  selector: '[appPositiveNumber]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: PositiveNumberDirective,
    multi: true
  }]
})
export class PositiveNumberDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const num = Number(control.value);
    if (isNaN(num) || num < 0) {
      return { 'positiveNumber': true };
    }
    return null;
  }
}

// Использование
@Component({
  selector: 'app-root',
  template: `
    <input type="number" 
           [(ngModel)]="value" 
           appPositiveNumber>
    <div *ngIf="form.get('number')?.errors?.['positiveNumber']">
      Число должно быть положительным
    </div>
  `
})
```

## Лучшие практики при работе с директивами

1. **Производительность**
   - Используйте `trackBy` с `*ngFor` для больших списков
   - Избегайте сложных вычислений в директивах
   - Используйте `OnPush` стратегию изменений где возможно

2. **Структура кода**
   - Разделяйте сложную логику на отдельные директивы
   - Следуйте принципу единой ответственности
   - Документируйте поведение пользовательских директив

3. **Повторное использование**
   - Создавайте универсальные директивы
   - Используйте входные параметры для конфигурации
   - Предусматривайте возможность расширения

4. **Отладка**
   - Добавляйте логирование в сложные директивы
   - Используйте декоратор `@HostListener` для отслеживания событий
   - Тестируйте граничные случаи


---

# Пайпы (Pipes) в Angular

Пайпы - это инструменты для трансформации данных в шаблонах. Они принимают входные данные и преобразуют их в желаемый формат для отображения.

## Встроенные пайпы

### 1. DatePipe

Форматирует даты согласно заданному формату.

```typescript
@Component({
  selector: 'app-date-demo',
  template: `
    <div>
      <!-- Базовое использование -->
      {{ today | date }}  <!-- Mar 15, 2025 -->
      
      <!-- С форматом -->
      {{ today | date:'short' }}     <!-- 3/15/25, 2:26 PM -->
      {{ today | date:'long' }}      <!-- March 15, 2025 at 2:26:05 PM GMT+2 -->
      {{ today | date:'dd.MM.yyyy' }} <!-- 15.03.2025 -->
      
      <!-- С локализацией -->
      {{ today | date:'long':'':'ru' }} <!-- 15 марта 2025 г., 14:26:05 GMT+2 -->
    </div>
  `
})
export class DateDemoComponent {
  today = new Date();
}
```

### 2. UpperCase, LowerCase и TitleCase

Преобразуют текст в верхний, нижний регистр или формат заголовка.

```typescript
@Component({
  selector: 'app-text-demo',
  template: `
    <div>
      {{ "привет мир" | uppercase }}  <!-- ПРИВЕТ МИР -->
      {{ "ПРИВЕТ МИР" | lowercase }}  <!-- привет мир -->
      {{ "привет мир" | titlecase }}  <!-- Привет Мир -->
    </div>
  `
})
```

### 3. AsyncPipe

Автоматически подписывается на Observable или Promise и отображает последнее значение.

```typescript
@Component({
  selector: 'app-async-demo',
  template: `
    <!-- Автоматическая подписка и отписка -->
    <div>{{ data$ | async }}</div>

    <!-- С использованием в *ngIf -->
    <div *ngIf="data$ | async as data">
      {{ data }}
    </div>
  `
})
export class AsyncDemoComponent {
  data$ = new Observable<string>(observer => {
    setTimeout(() => {
      observer.next('Данные получены');
    }, 1000);
  });
}
```

### 4. DecimalPipe и CurrencyPipe

Форматирование чисел и валют.

```typescript
@Component({
  selector: 'app-number-demo',
  template: `
    <!-- Форматирование чисел -->
    {{ 3.14159 | number:'1.2-2' }}  <!-- 3.14 -->
    {{ 42 | number:'3.0-0' }}       <!-- 042 -->
    
    <!-- Форматирование валют -->
    {{ 42.42 | currency:'USD' }}        <!-- $42.42 -->
    {{ 42.42 | currency:'EUR':'code' }} <!-- EUR 42.42 -->
    {{ 42.42 | currency:'RUB':'symbol-narrow' }} <!-- ₽42.42 -->
  `
})
```

## Создание кастомных пайпов

### 1. Простой пайп для сокращения текста

```typescript
// truncate.pipe.ts
@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 20, trail: string = '...'): string {
    if (!value) return '';
    
    return value.length > limit 
      ? value.substring(0, limit) + trail
      : value;
  }
}

// Использование
@Component({
  template: `
    <p>{{ "Очень длинный текст для проверки" | truncate:10 }}</p>
    <!-- Выведет: "Очень длин..." -->
  `
})
```

### 2. Пайп с параметрами для фильтрации массива

```typescript
// filter.pipe.ts
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], field: string, value: any): any[] {
    if (!items || !field || !value) return items;

    return items.filter(item => item[field].toLowerCase()
      .includes(value.toLowerCase()));
  }
}

// Использование
@Component({
  template: `
    <input [(ngModel)]="searchText">
    <div *ngFor="let item of items | filter:'name':searchText">
      {{ item.name }}
    </div>
  `
})
export class FilterDemoComponent {
  items = [
    { name: 'Яблоко' },
    { name: 'Банан' },
    { name: 'Апельсин' }
  ];
  searchText = '';
}
```

### 3. Пайп с кэшированием для тяжелых вычислений

```typescript
// fibonacci.pipe.ts
@Pipe({
  name: 'fibonacci'
})
export class FibonacciPipe implements PipeTransform {
  private cache = new Map<number, number>();

  transform(n: number): number {
    if (n <= 1) return n;
    
    if (this.cache.has(n)) {
      return this.cache.get(n)!;
    }

    const result = this.transform(n - 1) + this.transform(n - 2);
    this.cache.set(n, result);
    return result;
  }
}

// Использование
@Component({
  template: `
    <p>{{ 10 | fibonacci }}</p> <!-- 55 -->
  `
})
```

### 4. Пайп с состоянием (impure pipe)

```typescript
// time-ago.pipe.ts
@Pipe({
  name: 'timeAgo',
  pure: false // Делаем пайп impure для обновления каждую минуту
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date): string {
    const seconds = Math.floor((new Date().getTime() - value.getTime()) / 1000);
    
    if (seconds < 60) return 'только что';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} минут назад`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} часов назад`;
    return `${Math.floor(seconds / 86400)} дней назад`;
  }
}

// Использование
@Component({
  template: `
    <p>Опубликовано: {{ postDate | timeAgo }}</p>
  `
})
export class TimeAgoDemoComponent {
  postDate = new Date(Date.now() - 3600000); // 1 час назад
}
```

## Лучшие практики при работе с пайпами

1. **Производительность**
   - Используйте pure pipes по умолчанию
   - Избегайте тяжелых вычислений в пайпах
   - Кэшируйте результаты где это возможно

2. **Чистота**
   - Пайпы должны быть чистыми функциями (pure pipes)
   - Используйте impure pipes только когда это действительно необходимо
   - Не изменяйте входные данные в пайпе

3. **Повторное использование**
   - Создавайте универсальные пайпы
   - Используйте параметры для конфигурации
   - Документируйте параметры и поведение

4. **Обработка ошибок**
   - Всегда проверяйте входные данные
   - Предусматривайте значения по умолчанию
   - Обрабатывайте краевые случаи

5. **Тестирование**
   - Пишите модульные тесты для пайпов
   - Тестируйте различные входные параметры
   - Проверяйте обработку некорректных данных


---


ИТОГОВАЯ МЕТОДИКА ПРОВЕДЕНИЯ ВТОРОГО МОДУЛЯ КУРСА ПО ANGULAR (Компоненты, Директивы, Пайпы)

1. Компоненты в Angular
- Структура компонента (шаблон, стили, логика).
- Жизненный цикл компонентов:
  - Глубокое практическое рассмотрение хуков жизненного цикла (constructor, ngOnChanges, ngOnInit, ngDoCheck, ngAfterContentInit, ngAfterContentChecked, ngAfterViewInit, ngAfterViewChecked, ngOnDestroy).
  - Примеры и сценарии использования хуков.
  - Логическое понимание жизненного цикла как структуры управления компонентом.

2. Директивы в Angular
- Типы директив (компонентные, структурные, атрибутивные).
- Подробное рассмотрение встроенных директив: ngIf, ngFor, ngSwitch.
- Атрибутивные директивы: ngClass, ngStyle.
- Практическое создание собственных директив (highlight, unless, positive-number) с подробным объяснением шагов и лучших практик.

3. Пайпы в Angular
- Встроенные пайпы (DatePipe, UpperCase, LowerCase, TitleCase, AsyncPipe, DecimalPipe, CurrencyPipe).
- Практическое создание пользовательских пайпов (truncate, filter, fibonacci, timeAgo) с примерами использования.
- Рекомендации по производительности и повторному использованию пайпов.

ДОПОЛНИТЕЛЬНЫЕ ДОСМЫСЛЕНИЯ И УЛУЧШЕНИЯ, ВЫЯВЛЕННЫЕ В ПРОЦЕССЕ ЗАНЯТИЯ:

4. RxJS и работа с множественными источниками данных
- Четкие критерии и сценарии использования RxJS.
- Практические примеры сбора и обработки данных из множества источников, включая сенсоры и распределённые серверы.

5. Zone.js и Change Detection (углубленный анализ)
- Подробный разбор Zone.js и его роли в Angular.
- Объяснение работы механизма Change Detection в контексте Zone.js.
- Будущие изменения и переход на Zone-less подход.
- Сравнение Zone.js с подходами в React и Vue.

6. Signals (новый подход Angular)
- Что такое Signals и почему Angular движется к их использованию.
- Сценарии текущего применения Signals и предостережения по их экспериментальному статусу.
- Демонстрация практических примеров использования Signals.

ИТOГОВАЯ РАСШИРЕННАЯ СТРУКТУРА ВТОРОГО МОДУЛЯ:

1. Компоненты:
   - Структура компонента и жизненный цикл.
   - Практическое применение хуков и управление состоянием.

2. Директивы:
   - Типы и создание директив.
   - Практическая работа с встроенными и собственными директивами.

3. Пайпы:
   - Встроенные и пользовательские пайпы.
   - Рекомендации по разработке эффективных пайпов.

4. RxJS и сложные сценарии:
   - Использование RxJS в практических задачах.
   - Работа с асинхронными и распределёнными источниками данных.

5. Zone.js и Change Detection:
   - Глубокое понимание работы и оптимизация Zone.js.
   - Перспективы и практика Zone-less подхода.

6. Signals в Angular:
   - Введение и текущие возможности использования.
   - Практические рекомендации и осторожное внедрение.

Эти рекомендации сформированы для глубокого понимания и практического закрепления материала второго модуля, обеспечивая студентам эффективную подготовку и понимание перспектив развития Angular.
