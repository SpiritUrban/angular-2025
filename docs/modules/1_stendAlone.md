# Модуль 1. Введение в Angular (актуальная структура 2025)

## Основные возможности Angular

### Обзор фреймворка Angular
- **Angular** — современный фреймворк для разработки SPA (Single Page Application).  
- Поддерживает **Standalone Components**, что уменьшает зависимость от модулей (`NgModule`).  
- Использует **TypeScript**, что обеспечивает строгую типизацию и улучшает качество кода.  
- **RxJS** для реактивного программирования и обработки асинхронных данных.  
- **Typed Forms** — улучшенная типизация форм, что повышает удобство работы с ними.  

---

## Установка и настройка среды

### Предварительные требования
1. **Node.js** (версия LTS) — необходим для работы с Angular CLI.  
2. **Angular CLI** — инструмент для создания проектов и компонентов.  
3. **Visual Studio Code** — рекомендуемая IDE.  

### Установка Angular CLI
```bash
npm install -g @angular/cli
```

### Создание нового проекта
```bash
ng new first-2025 --standalone
```
**Пояснение:** флаг `--standalone` создает приложение без модулей, используя Standalone Components.  

### Запуск проекта
```bash
cd first-2025
ng serve
```
Открыть [http://localhost:4200](http://localhost:4200) для просмотра стартовой страницы.

---

## Структура проекта (2025)

### Основные директории и файлы
- **`src/`** — основная директория для разработки.  
  - **`app/`** — содержит главный компонент и конфигурационные файлы:  
    - **`app.component.ts`** — логика главного компонента.  
    - **`app.component.html`** — шаблон главного компонента.  
    - **`app.component.scss`** — стили главного компонента.  
    - **`app.config.ts`** — файл конфигурации приложения.  
    - **`app.routes.ts`** — маршруты приложения.  
  - **`index.html`** — основной HTML-файл приложения.  
  - **`main.ts`** — точка входа приложения.  
  - **`styles.scss`** — глобальные стили для всего приложения.  

### Файлы конфигурации
- **`angular.json`** — конфигурация Angular CLI.  
- **`package.json`** — перечень зависимостей и скриптов для управления проектом.  
- **`tsconfig.json`** — настройки TypeScript.  
- **`.editorconfig`**, **`.gitignore`**, **`.gitattributes`** — настройки редактора и Git.  

---

## Взаимодействие компонентов и маршрутизация

### Standalone Components
Angular позволяет создавать автономные компоненты:  
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  standalone: true,
  template: `<h1>Standalone Component</h1>`,
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent {}
```

### Маршрутизация
Маршруты задаются в **`app.routes.ts`**:  
```typescript
import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', loadComponent: () => import('./about.component').then(m => m.AboutComponent) }
];
```

---

## Практика

1. **Создание нового компонента:**  
   ```bash
   ng generate component example --standalone
   ```
2. **Добавление маршрута для компонента:**  
   ```typescript
   import { ExampleComponent } from './example.component';

   export const routes: Routes = [
     { path: 'example', component: ExampleComponent }
   ];
   ```

---

## Преимущества новой структуры
- **Меньше кода:** нет необходимости создавать отдельные модули.  
- **Легкая поддержка:** каждый компонент автономен и может быть легко перенесен.  
- **Улучшенная производительность:** благодаря Ivy и оптимизированной системе рендеринга.  
- **Гибкость маршрутизации:** использование динамической загрузки компонентов.
