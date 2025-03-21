# Модуль 1. Введение в Angular

## Основные возможности Angular

### Обзор фреймворка Angular
- Angular — это **полноценный фреймворк** для разработки SPA (Single Page Application).
- Использует **TypeScript**, что обеспечивает строгую типизацию и уменьшает количество ошибок.
- Декларативный подход к созданию UI через шаблоны (`HTML`) и мощную систему директив.
- **Инструменты:** встроенная поддержка реактивных форм, маршрутизации, HTTP-запросов, анимаций, модульности и **RxJS** для работы с асинхронными данными.

### Сильные стороны Angular
- **Богатый набор функций "из коробки"** — без необходимости устанавливать сторонние пакеты для маршрутизации, форм или управления состоянием.
- **Модульная структура:** позволяет легко масштабировать приложение.
- **Dependency Injection (DI):** удобный механизм для управления зависимостями.
- **Поддержка большого сообщества** и регулярные обновления от Google.
- **Ivy Renderer:** ускоряет компиляцию и рендеринг, улучшает производительность.

### Сравнение с другими фреймворками
- **React:**  
  - Библиотека для создания UI.  
  - Использует **Virtual DOM**, что ускоряет рендеринг.  
  - Гибкая архитектура, но требует дополнительных инструментов для работы с формами, маршрутизацией и т.д.  
  - Поддерживает JSX (сочетание JS и HTML в коде).  
- **Vue:**  
  - Простой для изучения, легче чем Angular.  
  - Поддерживает декларативный стиль шаблонов, похожий на Angular.  
  - Свободная архитектура, как у React.  
- **Вывод:** Angular больше подходит для крупных корпоративных проектов, где важны структура и масштабируемость.

---

## Установка и настройка среды

### Предварительные требования
1. **Node.js**: Angular использует Node для управления зависимостями через npm (Node Package Manager).  
2. **Angular CLI**: инструмент для автоматизации создания проектов и компонентов.  
3. **Visual Studio Code** — рекомендуемая IDE.  

### Установка Angular CLI
Команда для установки Angular CLI:
```bash
npm install -g @angular/cli
```

### Создание нового проекта
1. **Создание проекта:**  
   ```bash
   ng new my-angular-app
   ```
   Во время создания можно выбрать:  
   - Использовать SCSS или CSS.  
   - Нужна ли маршрутизация.  

2. **Запуск проекта:**  
   ```bash
   cd my-angular-app
   ng serve
   ```
3. Открыть [http://localhost:4200](http://localhost:4200) в браузере — проект готов.

---

## Структура проекта

### Основные директории и файлы
- **`src/`** — основная директория для разработки.  
  - **`app/`** — главный модуль и компоненты приложения:  
    - **`app.component.ts`** — логика компонента.  
    - **`app.component.html`** — шаблон компонента.  
    - **`app.component.css`** — стили компонента.  
- **`app.module.ts`** — главный модуль приложения.  
  - Регистрирует все компоненты, сервисы, пайпы и директивы.  
  - Подключает внешние модули (`FormsModule`, `RouterModule`).  
- **`main.ts`** — точка входа приложения. Подключает `AppModule` и запускает Angular.  
- **`angular.json`** — файл конфигурации Angular CLI. Содержит настройки для сборки проекта.  

### Взаимодействие компонентов, модулей и конфигураций
1. **Модули (`NgModule`):** Angular-приложения состоят из модулей. Главный модуль — `AppModule`.  
2. **Компоненты:** каждый компонент отвечает за определенную часть UI.  
3. **Конфигурации:** через файл `angular.json` можно настраивать пути, стили, скрипты.  

### Взаимодействие между компонентами
- Angular использует **однонаправленный поток данных**.  
- Компоненты общаются через Input/Output декораторы или сервисы.  

### Практика
1. **Создание нового компонента:**  
   ```bash
   ng generate component example
   ```
2. **Добавление компонента в `app.component.html`:**  
   ```html
   <app-example></app-example>
   ```
