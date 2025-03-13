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
