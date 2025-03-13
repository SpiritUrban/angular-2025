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
