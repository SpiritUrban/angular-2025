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
