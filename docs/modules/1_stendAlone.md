
# Модуль 1. Вступ до Angular (актуальна структура 2025)

## Основні можливості Angular

### Огляд фреймворка Angular
- **Angular** — сучасний фреймворк для розробки SPA (Single Page Application).  
- Підтримує **Standalone Components**, що зменшує залежність від модулів (`NgModule`).  
- Використовує **TypeScript**, що забезпечує сильну типізацію та покращує якість коду.  
- **RxJS** для реактивного програмування та обробки асинхронних даних.  
- **Typed Forms** — покращена типізація форм, що підвищує зручність роботи з ними.  

---

## Встановлення та налаштування середовища

### Передумови
1. **Node.js** (версія LTS) — необхідний для роботи з Angular CLI.  
2. **Angular CLI** — інструмент для створення проєктів і компонентів.  
3. **Visual Studio Code** — рекомендована IDE.  

### Встановлення Angular CLI
```bash
npm install -g @angular/cli
```

### Створення нового проєкту
```bash
ng new first-2025 --standalone
```
**Пояснення:** прапор `--standalone` створює додаток без модулів, використовуючи Standalone Components.  

### Запуск проєкту
```bash
cd first-2025
ng serve
```
Відкрити [http://localhost:4200](http://localhost:4200) для перегляду стартової сторінки.

---

## Структура проєкту (2025)

### Основні директорії та файли
- **`src/`** — основна директорія для розробки.  
  - **`app/`** — містить головний компонент і конфігураційні файли:  
    - **`app.component.ts`** — логіка головного компонента.  
    - **`app.component.html`** — шаблон головного компонента.  
    - **`app.component.scss`** — стилі головного компонента.  
    - **`app.config.ts`** — файл конфігурації додатка.  
    - **`app.routes.ts`** — маршрути додатка.  
  - **`index.html`** — основний HTML-файл додатка.  
  - **`main.ts`** — точка входу додатка.  
  - **`styles.scss`** — глобальні стилі для всього додатка.  

### Файли конфігурації
- **`angular.json`** — конфігурація Angular CLI.  
- **`package.json`** — перелік залежностей і скриптів для управління проєктом.  
- **`tsconfig.json`** — налаштування TypeScript.  
- **`.editorconfig`**, **`.gitignore`**, **`.gitattributes`** — налаштування редактора та Git.  

---

## Взаємодія компонентів та маршрутизація

### Standalone Components
Angular дозволяє створювати автономні компоненти:  
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

### Маршрутизація
Маршрути задаються у **`app.routes.ts`**:  
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

1. **Створення нового компонента:**  
   ```bash
   ng generate component example --standalone
   ```
2. **Додавання маршруту для компонента:**  
   ```typescript
   import { ExampleComponent } from './example.component';

   export const routes: Routes = [
     { path: 'example', component: ExampleComponent }
   ];
   ```

---

## Переваги нової структури
- **Менше коду:** немає потреби створювати окремі модулі.  
- **Легша підтримка:** кожен компонент автономний і може бути легко перенесений.  
- **Покращена продуктивність:** завдяки Ivy та оптимізованій системі рендерингу.  
- **Гнучкість маршрутизації:** використання динамічного завантаження компонентів.
