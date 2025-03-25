# Angular Router Features Checklist

## Базовые возможности
- Настройка маршрутизации с `RouterModule.forRoot()`
- Ленивая загрузка модулей с `loadChildren`
- Использование параметров маршрута
- Охранники (Guards): `CanActivate`, `CanDeactivate`, `Resolve` и другие
- Обработка ошибок навигации с `ErrorHandler`
- Динамические пути: wildcard маршруты
- Redirects и fallback маршруты
- Анимации маршрутов
- Модальные окна и дочерние маршруты

## Дополнительные возможности
- Prefetching и предварительная загрузка модулей
- Route Resolvers: предварительная загрузка данных
- Обработка query параметров
- Навигация с использованием фрагментов
- Custom Route Matching
- Подписка на события роутера: `NavigationStart`, `NavigationEnd` и другие

## Примечания
Этот список поможет в полной мере использовать все возможности роутинга в Angular.


---

# Настройка маршрутизации: Использование RouterModule и создание конфигурации маршрутов

## Введение в маршрутизацию Angular

Маршрутизация в Angular позволяет создавать приложения с несколькими представлениями (страницами) и обеспечивает навигацию между ними. Angular Router обеспечивает полноценную навигацию в браузере с сохранением истории и поддержкой закладок.

## Базовая настройка маршрутизации

### 1. Определение маршрутов

```typescript
// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: '' } // Маршрут по умолчанию
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

### 2. Подключение маршрутизации

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### 3. Добавление router-outlet

```typescript
// app.component.ts
@Component({
  selector: 'app-root',
  template: `
    <nav>
      <a routerLink="/">Home</a>
      <a routerLink="/about">About</a>
      <a routerLink="/contact">Contact</a>
    </nav>
    
    <router-outlet></router-outlet>
  `
})
export class AppComponent { }
```

## Продвинутая конфигурация маршрутов

### 1. Вложенные маршруты

```typescript
const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'settings', component: AdminSettingsComponent }
    ]
  }
];

// admin.component.html
@Component({
  template: `
    <nav>
      <a routerLink="./users">Users</a>
      <a routerLink="./settings">Settings</a>
    </nav>
    
    <router-outlet></router-outlet>
  `
})
export class AdminComponent { }
```

### 2. Именованные router-outlet

```typescript
const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: 'help',
        component: HelpComponent,
        outlet: 'sidebar'
      }
    ]
  }
];

// template
@Component({
  template: `
    <router-outlet></router-outlet>
    <router-outlet name="sidebar"></router-outlet>
  `
})
```

### 3. Настройка стратегии навигации

```typescript
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled', // Восстановление позиции скролла
      anchorScrolling: 'enabled', // Поддержка якорей
      scrollOffset: [0, 64], // Отступ при скролле
      useHash: false // Использование хэш-навигации
    })
  ]
})
export class AppRoutingModule { }
```

## Работа с RouterLink

### 1. Базовое использование

```html
<!-- Простые ссылки -->
<a routerLink="/about">About</a>

<!-- Относительные пути -->
<a routerLink="../contact">Contact</a>

<!-- Массив сегментов пути -->
<a [routerLink]="['user', userId]">User Profile</a>
```

### 2. RouterLinkActive

```html
<nav>
  <a routerLink="/"
     routerLinkActive="active"
     [routerLinkActiveOptions]="{ exact: true }">
    Home
  </a>
  <a routerLink="/about"
     routerLinkActive="active">
    About
  </a>
</nav>

<style>
.active {
  color: red;
  font-weight: bold;
}
</style>
```

### 3. Параметры запроса

```html
<!-- С параметрами запроса -->
<a [routerLink]="['/products']"
   [queryParams]="{ category: 'books', sort: 'price' }">
  Books
</a>

<!-- Сохранение параметров -->
<a [routerLink]="['/products']"
   [queryParams]="{ category: 'electronics' }"
   queryParamsHandling="merge">
  Electronics
</a>
```

## Программная навигация

### 1. Базовая навигация

```typescript
@Component({
  template: `
    <button (click)="goToAbout()">Go to About</button>
  `
})
export class NavigationComponent {
  constructor(private router: Router) {}

  goToAbout() {
    this.router.navigate(['/about']);
  }
}
```

### 2. Навигация с параметрами

```typescript
export class NavigationComponent {
  constructor(private router: Router) {}

  goToProduct(id: string) {
    this.router.navigate(['/product', id], {
      queryParams: { ref: 'homepage' },
      fragment: 'description'
    });
  }
}
```

### 3. Относительная навигация

```typescript
export class ProductComponent {
  constructor(private router: Router,
              private route: ActivatedRoute) {}

  goToDetails() {
    this.router.navigate(['details'], {
      relativeTo: this.route
    });
  }
}
```

## Обработка событий навигации

### 1. Подписка на события

```typescript
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        console.log('Navigation started');
      }
      if (event instanceof NavigationEnd) {
        console.log('Navigation ended');
      }
      if (event instanceof NavigationError) {
        console.log('Navigation failed');
      }
    });
  }
}
```

### 2. Отслеживание прогресса загрузки

```typescript
@Component({
  template: `
    <div *ngIf="loading" class="loading-bar"></div>
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {
  loading = false;

  constructor(private router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      }
      if (event instanceof NavigationEnd ||
          event instanceof NavigationError) {
        this.loading = false;
      }
    });
  }
}
```

## Лучшие практики

### 1. Организация маршрутов

```typescript
// Разделение маршрутов по модулям
const routes: Routes = [
  { path: '', component: HomeComponent },
  { 
    path: 'admin',
    loadChildren: () => import('./admin/admin.module')
      .then(m => m.AdminModule)
  },
  {
    path: 'shop',
    loadChildren: () => import('./shop/shop.module')
      .then(m => m.ShopModule)
  }
];
```

### 2. Типизация параметров

```typescript
// route-params.interface.ts
export interface ProductRouteParams {
  id: string;
  category?: string;
}

// product.component.ts
export class ProductComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params: ProductRouteParams) => {
      const productId = params.id;
      const category = params.category;
    });
  }
}
```

### 3. Сервис для навигации

```typescript
@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  constructor(private router: Router) {}

  goToProduct(id: string, options?: NavigationOptions) {
    return this.router.navigate(['/product', id], options);
  }

  goToCategory(category: string) {
    return this.router.navigate(['/products'], {
      queryParams: { category }
    });
  }
}
```

### 4. Обработка ошибок маршрутизации

```typescript
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {
  constructor(private router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationError) {
        console.error('Navigation Error:', event.error);
        this.router.navigate(['/404']);
      }
    });
  }
}
```

### 5. Предзагрузка данных

```typescript
@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<Product> {
  constructor(private productService: ProductService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Product> {
    const id = route.paramMap.get('id');
    return this.productService.getProduct(id);
  }
}

const routes: Routes = [
  {
    path: 'product/:id',
    component: ProductComponent,
    resolve: {
      product: ProductResolver
    }
  }
];
```


---

# Динамические маршруты: Передача параметров через URL (ActivatedRoute)

## Введение в динамические маршруты

Динамические маршруты в Angular позволяют передавать параметры через URL и создавать гибкие пути для компонентов. Это особенно полезно при работе с данными, которые имеют уникальные идентификаторы или фильтры.

## Параметры маршрута

### 1. Обязательные параметры

```typescript
// app-routing.module.ts
const routes: Routes = [
  { path: 'product/:id', component: ProductComponent }
];

// product.component.ts
@Component({
  template: `
    <div *ngIf="product">
      <h2>{{ product.name }}</h2>
      <p>{{ product.description }}</p>
    </div>
  `
})
export class ProductComponent implements OnInit {
  product: Product;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit() {
    // Получение параметра один раз
    const id = this.route.snapshot.paramMap.get('id');
    
    // Подписка на изменения параметра
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.loadProduct(id);
    });
  }

  private loadProduct(id: string) {
    this.productService.getProduct(id)
      .subscribe(product => this.product = product);
  }
}
```

### 2. Опциональные параметры

```typescript
// routes
const routes: Routes = [
  { path: 'products/:category/:id', component: ProductComponent }
];

// component
@Component({
  template: `
    <div *ngIf="product">
      <h2>{{ product.name }}</h2>
      <p>Category: {{ category }}</p>
    </div>
  `
})
export class ProductComponent implements OnInit {
  product: Product;
  category: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.category = params.get('category');
      const id = params.get('id');
      // Загрузка продукта
    });
  }
}
```

## Query Parameters

### 1. Работа с Query Parameters

```typescript
// template
<a [routerLink]="['/products']"
   [queryParams]="{ sort: 'price', order: 'desc' }">
  Sort by price
</a>

// component
@Component({
  template: `
    <div>
      <h2>Products</h2>
      <div *ngFor="let product of sortedProducts">
        {{ product.name }} - {{ product.price }}
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  sortedProducts: Product[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const sort = params.get('sort');
      const order = params.get('order');
      this.sortProducts(sort, order);
    });
  }

  private sortProducts(sort: string, order: string) {
    this.sortedProducts = [...this.products].sort((a, b) => {
      const modifier = order === 'desc' ? -1 : 1;
      return (a[sort] - b[sort]) * modifier;
    });
  }
}
```

### 2. Сохранение Query Parameters

```typescript
// Сохранение при навигации
this.router.navigate(['/products'], {
  queryParams: { sort: 'price' },
  queryParamsHandling: 'merge' // или 'preserve'
});

// В шаблоне
<a [routerLink]="['/products']"
   [queryParams]="{ category: 'electronics' }"
   queryParamsHandling="merge">
  Electronics
</a>
```

## Fragments (Якоря)

```typescript
// В маршрутизации
this.router.navigate(['/article/123'], {
  fragment: 'comments'
});

// В шаблоне
<a [routerLink]="['/article/123']"
   fragment="comments">
  Go to Comments
</a>

// Получение fragment
@Component({
  template: `
    <div>
      <h1>Article</h1>
      <div id="comments">
        <h2>Comments</h2>
        <!-- comments list -->
      </div>
    </div>
  `
})
export class ArticleComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }
}
```

## Комплексные примеры

### 1. Фильтрация и пагинация

```typescript
interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  perPage?: number;
}

@Component({
  template: `
    <div class="filters">
      <select (change)="updateFilters('category', $event.target.value)">
        <option *ngFor="let cat of categories" [value]="cat">
          {{ cat }}
        </option>
      </select>
      
      <input type="number" 
             [value]="filters.minPrice"
             (change)="updateFilters('minPrice', $event.target.value)">
             
      <input type="number"
             [value]="filters.maxPrice"
             (change)="updateFilters('maxPrice', $event.target.value)">
    </div>

    <div class="products">
      <!-- product list -->
    </div>

    <div class="pagination">
      <button (click)="changePage(currentPage - 1)">Previous</button>
      <span>Page {{ currentPage }}</span>
      <button (click)="changePage(currentPage + 1)">Next</button>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  filters: ProductFilters = {};
  currentPage = 1;
  products: Product[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.filters = {
        category: params.get('category'),
        minPrice: Number(params.get('minPrice')),
        maxPrice: Number(params.get('maxPrice')),
        page: Number(params.get('page')) || 1,
        perPage: Number(params.get('perPage')) || 10
      };
      this.loadProducts();
    });
  }

  updateFilters(key: keyof ProductFilters, value: any) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ...this.filters, [key]: value },
      queryParamsHandling: 'merge'
    });
  }

  changePage(page: number) {
    if (page < 1) return;
    this.updateFilters('page', page);
  }

  private loadProducts() {
    // Загрузка продуктов с учетом фильтров
  }
}
```

### 2. Вложенные динамические маршруты

```typescript
const routes: Routes = [
  {
    path: 'shop/:category',
    component: CategoryComponent,
    children: [
      {
        path: 'product/:id',
        component: ProductComponent,
        children: [
          { path: 'reviews', component: ReviewsComponent },
          { path: 'specifications', component: SpecsComponent }
        ]
      }
    ]
  }
];

@Component({
  template: `
    <div class="category">
      <h1>{{ category }}</h1>
      <div class="products">
        <a *ngFor="let product of products"
           [routerLink]="['product', product.id]">
          {{ product.name }}
        </a>
      </div>
      <router-outlet></router-outlet>
    </div>
  `
})
export class CategoryComponent implements OnInit {
  category: string;
  products: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.category = params.get('category');
      this.loadProducts();
    });
  }

  private loadProducts() {
    this.productService.getProductsByCategory(this.category)
      .subscribe(products => this.products = products);
  }
}
```

## Лучшие практики

### 1. Типизация параметров

```typescript
interface RouteParams {
  id: string;
  category: string;
}

interface QueryParams {
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
}

@Component({})
export class ProductComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.pipe(
      map((params: RouteParams) => ({
        id: params.id,
        category: params.category
      }))
    ).subscribe(params => {
      // Типизированные параметры
    });

    this.route.queryParams.pipe(
      map((params: QueryParams) => ({
        sort: params.sort,
        order: params.order || 'asc',
        page: Number(params.page) || 1
      }))
    ).subscribe(params => {
      // Типизированные query параметры
    });
  }
}
```

### 2. Сервис для работы с URL параметрами

```typescript
@Injectable({
  providedIn: 'root'
})
export class UrlService {
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  updateQueryParams(params: Partial<QueryParams>) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge'
    });
  }

  getQueryParams(): Observable<QueryParams> {
    return this.route.queryParams.pipe(
      map(params => ({
        sort: params.sort,
        order: params.order,
        page: Number(params.page) || 1
      }))
    );
  }
}
```

### 3. Обработка изменений параметров

```typescript
@Component({})
export class ProductListComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Комбинирование параметров маршрута и query параметров
    combineLatest([
      this.route.paramMap,
      this.route.queryParamMap
    ]).pipe(
      map(([params, queryParams]) => ({
        category: params.get('category'),
        sort: queryParams.get('sort'),
        page: Number(queryParams.get('page')) || 1
      })),
      distinctUntilChanged((prev, curr) => 
        JSON.stringify(prev) === JSON.stringify(curr)
      )
    ).subscribe(params => {
      // Обработка изменений
    });
  }
}
```

### 4. Сохранение состояния

```typescript
@Injectable({
  providedIn: 'root'
})
export class StateService {
  private state = new BehaviorSubject<any>(null);

  setState(state: any) {
    this.state.next(state);
  }

  getState(): Observable<any> {
    return this.state.asObservable();
  }
}

@Component({})
export class ProductListComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private stateService: StateService
  ) {}

  ngOnInit() {
    // Восстановление состояния при навигации
    this.stateService.getState().pipe(
      take(1)
    ).subscribe(state => {
      if (state) {
        // Восстановление состояния
      }
    });

    // Сохранение состояния при уходе
    this.route.queryParams.subscribe(params => {
      this.stateService.setState(params);
    });
  }
}
```


---

# Route Guards и Lazy Loading: Защита маршрутов и оптимизация загрузки модулей

## Route Guards

Route Guards в Angular позволяют контролировать доступ к маршрутам и навигацию между ними. Они помогают защитить маршруты от несанкционированного доступа и предотвратить потерю несохраненных данных.

### 1. CanActivate

```typescript
// auth.guard.ts
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    
    // Перенаправление на страницу входа
    return this.router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }
}

// Применение в маршрутах
const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard]
  }
];
```

### 2. CanActivateChild

```typescript
@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    return this.authService.isAdmin()
      ? true
      : this.router.createUrlTree(['/forbidden']);
  }
}

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: 'users', component: UsersComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  }
];
```

### 3. CanDeactivate

```typescript
// Интерфейс для компонентов с несохраненными изменениями
export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Promise<boolean> | Observable<boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
  canDeactivate(
    component: ComponentCanDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): boolean | Observable<boolean> {
    return component.canDeactivate()
      ? true
      : confirm('У вас есть несохраненные изменения. Вы уверены, что хотите уйти?');
  }
}

@Component({})
export class EditorComponent implements ComponentCanDeactivate {
  isDirty = false;

  canDeactivate(): boolean {
    return !this.isDirty;
  }
}

const routes: Routes = [
  {
    path: 'editor',
    component: EditorComponent,
    canDeactivate: [UnsavedChangesGuard]
  }
];
```

### 4. Resolve

```typescript
@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<Product> {
  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Product> {
    const id = route.paramMap.get('id');
    
    return this.productService.getProduct(id).pipe(
      catchError(() => {
        this.router.navigate(['/not-found']);
        return EMPTY;
      })
    );
  }
}

const routes: Routes = [
  {
    path: 'product/:id',
    component: ProductComponent,
    resolve: {
      product: ProductResolver
    }
  }
];

@Component({})
export class ProductComponent implements OnInit {
  product: Product;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.product = data.product;
    });
  }
}
```

## Lazy Loading

Lazy Loading позволяет загружать модули по требованию, что улучшает начальное время загрузки приложения.

### 1. Настройка модуля для Lazy Loading

```typescript
// app-routing.module.ts
const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module')
      .then(m => m.AdminModule)
  },
  {
    path: 'shop',
    loadChildren: () => import('./shop/shop.module')
      .then(m => m.ShopModule)
  }
];

// admin/admin-routing.module.ts
const adminRoutes: Routes = [
  {
    path: '', // пустой путь, так как родительский путь уже содержит 'admin'
    component: AdminComponent,
    children: [
      { path: 'users', component: UsersComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
```

### 2. Предзагрузка модулей

```typescript
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules // или CustomPreloadingStrategy
    })
  ]
})
export class AppRoutingModule { }

// Пользовательская стратегия предзагрузки
@Injectable({
  providedIn: 'root'
})
export class CustomPreloadingStrategy implements PreloadAllModules {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    return route.data && route.data.preload 
      ? load()
      : of(null);
  }
}

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module')
      .then(m => m.AdminModule),
    data: { preload: true }
  }
];
```

## Комплексные примеры

### 1. Аутентификация и авторизация

```typescript
// auth.service.ts
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user$ = new BehaviorSubject<User | null>(null);

  login(credentials: Credentials): Observable<User> {
    return this.http.post<User>('/api/login', credentials).pipe(
      tap(user => this.user$.next(user))
    );
  }

  logout(): void {
    this.user$.next(null);
    this.router.navigate(['/login']);
  }

  getUser(): Observable<User | null> {
    return this.user$.asObservable();
  }

  isAuthenticated(): boolean {
    return !!this.user$.value;
  }

  hasRole(role: string): boolean {
    return this.user$.value?.roles.includes(role) ?? false;
  }
}

// role.guard.ts
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const requiredRole = route.data.role;

    if (this.authService.hasRole(requiredRole)) {
      return true;
    }

    return this.router.createUrlTree(['/forbidden']);
  }
}

// routes
const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module')
      .then(m => m.AdminModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'ADMIN' }
  }
];
```

### 2. Комплексная защита форм

```typescript
@Injectable({
  providedIn: 'root'
})
export class FormGuard implements CanDeactivate<any> {
  canDeactivate(
    component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    // Проверка наличия несохраненных изменений
    if (component.form?.dirty) {
      return new Observable<boolean>(observer => {
        const modalRef = this.modal.open(ConfirmDialogComponent, {
          data: {
            title: 'Несохраненные изменения',
            message: 'Вы уверены, что хотите покинуть страницу?'
          }
        });

        modalRef.afterClosed().subscribe(result => {
          observer.next(result);
          observer.complete();
        });
      });
    }

    return true;
  }
}
```

## Лучшие практики

### 1. Организация Guards

```typescript
// guards/index.ts
export * from './auth.guard';
export * from './admin.guard';
export * from './form.guard';

// Фабрика для создания guard
export function createPermissionGuard(permission: string): CanActivateFn {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    return authService.hasPermission(permission);
  };
}

const routes: Routes = [
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [() => createPermissionGuard('users.view')]
  }
];
```

### 2. Оптимизация Lazy Loading

```typescript
// Отслеживание загрузки модулей
@Injectable({
  providedIn: 'root'
})
export class RouteService {
  private loadedModules = new Set<string>();

  constructor(private router: Router) {
    router.events.pipe(
      filter(event => event instanceof RouteConfigLoadStart)
    ).subscribe((event: RouteConfigLoadStart) => {
      console.log(`Loading module for route: ${event.route.path}`);
    });

    router.events.pipe(
      filter(event => event instanceof RouteConfigLoadEnd)
    ).subscribe((event: RouteConfigLoadEnd) => {
      this.loadedModules.add(event.route.path);
    });
  }

  isModuleLoaded(path: string): boolean {
    return this.loadedModules.has(path);
  }
}
```

### 3. Типизация данных маршрута

```typescript
interface RouteData {
  title: string;
  role?: string;
  preload?: boolean;
}

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module')
      .then(m => m.AdminModule),
    data: {
      title: 'Admin Panel',
      role: 'ADMIN',
      preload: true
    } as RouteData
  }
];

// Использование в компоненте
@Component({})
export class AdminComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe((data: RouteData) => {
      document.title = data.title;
    });
  }
}
```

### 4. Обработка ошибок при загрузке модулей

```typescript
@Injectable({
  providedIn: 'root'
})
export class RouteErrorHandler {
  constructor(private router: Router) {
    router.events.pipe(
      filter(event => event instanceof RouteConfigLoadError)
    ).subscribe((event: RouteConfigLoadError) => {
      console.error('Error loading module:', event);
      this.router.navigate(['/error'], {
        queryParams: { code: 'MODULE_LOAD_ERROR' }
      });
    });
  }
}
```


---

# Lazy Loading: Оптимизация загрузки модулей

## Введение в Lazy Loading

Lazy Loading (ленивая загрузка) — это техника оптимизации в Angular, которая позволяет загружать модули по требованию, а не при начальной загрузке приложения. Это значительно уменьшает размер начального бандла и ускоряет первоначальную загрузку приложения.

## Настройка Lazy Loading

### 1. Структура модуля

```typescript
// shop.module.ts
@NgModule({
  declarations: [
    ShopComponent,
    ProductListComponent,
    ProductDetailComponent
  ],
  imports: [
    CommonModule,
    ShopRoutingModule  // Отдельный модуль маршрутизации
  ]
})
export class ShopModule { }

// shop-routing.module.ts
const routes: Routes = [
  {
    path: '',  // Пустой путь, так как основной путь указан в главном роутере
    component: ShopComponent,
    children: [
      { path: 'products', component: ProductListComponent },
      { path: 'product/:id', component: ProductDetailComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
```

### 2. Настройка основного маршрутизатора

```typescript
// app-routing.module.ts
const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'shop',
    loadChildren: () => import('./shop/shop.module')
      .then(m => m.ShopModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module')
      .then(m => m.AdminModule)
  }
];
```

## Стратегии предзагрузки

### 1. PreloadAllModules

```typescript
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    })
  ]
})
export class AppRoutingModule { }
```

### 2. Пользовательская стратегия предзагрузки

```typescript
@Injectable({
  providedIn: 'root'
})
export class SelectivePreloadingStrategy implements PreloadAllModules {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    return route.data?.['preload'] === true ? load() : of(null);
  }
}

// Использование в маршрутах
const routes: Routes = [
  {
    path: 'shop',
    loadChildren: () => import('./shop/shop.module')
      .then(m => m.ShopModule),
    data: { preload: true }  // Этот модуль будет предзагружен
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module')
      .then(m => m.AdminModule)
    // Этот модуль не будет предзагружен
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: SelectivePreloadingStrategy
    })
  ]
})
export class AppRoutingModule { }
```

## Оптимизация загрузки

### 1. Разделение на подмодули

```typescript
// admin.module.ts
const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'users',
        loadChildren: () => import('./users/users.module')
          .then(m => m.UsersModule)
      },
      {
        path: 'products',
        loadChildren: () => import('./products/products.module')
          .then(m => m.ProductsModule)
      }
    ]
  }
];
```

### 2. Оптимизация размера модуля

```typescript
// Используйте отдельные модули для функциональности
@NgModule({
  imports: [
    CommonModule,
    // Импортируйте только необходимые модули
    FormsModule,  // Вместо ReactiveFormsModule, если используете только простые формы
    RouterModule.forChild(routes)
  ],
  declarations: [
    // Объявляйте только компоненты, используемые в этом модуле
    ProductListComponent,
    ProductDetailComponent
  ]
})
export class ProductsModule { }
```

## Отслеживание загрузки модулей

### 1. Индикатор загрузки

```typescript
@Component({
  selector: 'app-root',
  template: `
    <div *ngIf="isLoading" class="loading-indicator">
      Loading...
    </div>
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {
  isLoading = false;

  constructor(private router: Router) {
    router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart) {
        this.isLoading = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.isLoading = false;
      }
    });
  }
}
```

### 2. Обработка ошибок загрузки

```typescript
@Injectable({
  providedIn: 'root'
})
export class ModuleLoadingService {
  constructor(private router: Router) {
    router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadError) {
        console.error('Error loading module:', event);
        // Перенаправление на страницу ошибки
        this.router.navigate(['/error']);
      }
    });
  }
}
```

## Практические примеры

### 1. Модуль администрирования

```typescript
// admin/admin.module.ts
@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ],
  declarations: [
    AdminDashboardComponent,
    AdminNavComponent
  ]
})
export class AdminModule { }

// admin/admin-routing.module.ts
const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', component: AdminDashboardComponent },
      {
        path: 'users',
        loadChildren: () => import('./users/users.module')
          .then(m => m.UsersModule)
      },
      {
        path: 'products',
        loadChildren: () => import('./products/products.module')
          .then(m => m.ProductsModule)
      },
      {
        path: 'orders',
        loadChildren: () => import('./orders/orders.module')
          .then(m => m.OrdersModule)
      }
    ]
  }
];
```

### 2. Модуль электронной коммерции

```typescript
// shop/shop.module.ts
@NgModule({
  imports: [
    CommonModule,
    ShopRoutingModule,
    SharedModule
  ],
  declarations: [
    ShopComponent,
    ProductGridComponent
  ]
})
export class ShopModule { }

// shop/shop-routing.module.ts
const routes: Routes = [
  {
    path: '',
    component: ShopComponent,
    children: [
      { path: '', component: ProductGridComponent },
      {
        path: 'cart',
        loadChildren: () => import('./cart/cart.module')
          .then(m => m.CartModule)
      },
      {
        path: 'checkout',
        loadChildren: () => import('./checkout/checkout.module')
          .then(m => m.CheckoutModule)
      }
    ]
  }
];
```

## Лучшие практики

### 1. Организация модулей

```typescript
// Разделяйте функциональность на логические модули
// feature/feature.module.ts
@NgModule({
  imports: [
    CommonModule,
    FeatureRoutingModule,
    SharedModule
  ],
  declarations: [
    FeatureComponent,
    FeatureListComponent,
    FeatureDetailComponent
  ]
})
export class FeatureModule { }
```

### 2. Оптимизация производительности

```typescript
// Используйте динамический импорт компонентов
const routes: Routes = [
  {
    path: 'feature',
    loadChildren: () => import('./feature/feature.module')
      .then(m => m.FeatureModule),
    data: { preload: true }
  }
];

// Используйте общий SharedModule для часто используемых компонентов
@NgModule({
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    // Общие компоненты
    HeaderComponent,
    FooterComponent,
    LoadingSpinnerComponent
  ]
})
export class SharedModule { }
```

### 3. Обработка состояния загрузки

```typescript
@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(private router: Router) {
    router.events.pipe(
      filter(event => 
        event instanceof RouteConfigLoadStart ||
        event instanceof RouteConfigLoadEnd ||
        event instanceof RouteConfigLoadError
      )
    ).subscribe(event => {
      if (event instanceof RouteConfigLoadStart) {
        this.loadingSubject.next(true);
      } else {
        this.loadingSubject.next(false);
      }
    });
  }
}
```

### 4. Типизация и документация

```typescript
// Определение интерфейсов для данных модуля
interface ModuleConfig {
  preload: boolean;
  roles: string[];
}

// Использование в маршрутах
const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module')
      .then(m => m.AdminModule),
    data: {
      preload: true,
      roles: ['ADMIN']
    } as ModuleConfig
  }
];
```


---


ИТОГОВАЯ МЕТОДИКА ПРОВЕДЕНИЯ ПЯТОГО МОДУЛЯ КУРСА ПО ANGULAR (Роутинг и Навигация)

1. Введение в роутинг в Angular
- Общий обзор возможностей Angular Router.
- Практическая конфигурация маршрутизации с помощью RouterModule.forRoot().
- Подробности настройки и практические рекомендации.

2. Настройка маршрутизации и конфигурация RouterModule
- Базовые и продвинутые возможности:
  - Вложенные маршруты и именованные router-outlet.
  - Настройка стратегий навигации и использование routerLink, routerLinkActive.
- Программная навигация, обработка событий роутера.
- Лучшие практики организации маршрутов.

3. Динамические маршруты и передача параметров
- Практическое использование ActivatedRoute.
- Обязательные и опциональные параметры маршрута.
- Query-параметры и фрагменты.
- Реализация комплексных сценариев (фильтрация, пагинация).
- Практические рекомендации по работе с параметрами и состоянием.

4. Route Guards и защита маршрутов
- Практическое применение Guard'ов: CanActivate, CanActivateChild, CanDeactivate, Resolve.
- Примеры реализации охраны маршрутов для защиты данных и предотвращения несохранённых изменений.
- Глубокое обсуждение сценариев использования Guard'ов в реальной практике.

5. Lazy Loading и оптимизация загрузки модулей
- Настройка и практическое применение ленивой загрузки.
- Стратегии предварительной загрузки модулей (PreloadAllModules, Custom Preloading Strategy).
- Примеры правильного структурирования и оптимизации модулей.

ДОПОЛНИТЕЛЬНЫЕ ДОСМЫСЛЕНИЯ И УЛУЧШЕНИЯ В ПРОЦЕССЕ ЗАНЯТИЯ:

6. Углубленный разбор конфигурации маршрутов:
- Использование providers и RouterModule.
- Конкретизация деталей настройки маршрутизации в больших приложениях.

7. Практическое применение Route Guards:
- Рекомендации по выбору и применению Guard'ов.
- Реальные примеры и углублённое понимание принципов работы каждого типа Guard'ов.

8. Динамическая передача данных между компонентами:
- Уточнены подходы и примеры передачи параметров.
- Практическая демонстрация и рекомендации.

9. Практическое применение Lazy Loading:
- Реализация и оптимизация ленивой загрузки модулей.
- Подробные рекомендации по использованию различных стратегий загрузки модулей.

ИТОГОВАЯ РАСШИРЕННАЯ СТРУКТУРА ПЯТОГО МОДУЛЯ:

1. Основы маршрутизации:
   - Возможности и настройка Angular Router.

2. Конфигурация маршрутов:
   - Вложенные маршруты, стратегии навигации.
   - Практическое использование RouterLink и программной навигации.

3. Динамические маршруты:
   - Работа с параметрами маршрутов и query-параметрами.
   - Практические сценарии и лучшие практики.

4. Route Guards:
   - Реализация защиты маршрутов.
   - Практические примеры и рекомендации.

5. Lazy Loading:
   - Оптимизация модулей и предварительная загрузка.
   - Стратегии и примеры использования.

6. Углублённый разбор дополнительных аспектов:
   - Конфигурация больших приложений.
   - Передача данных и оптимизация загрузки.

Эта методика обеспечивает глубокое понимание роутинга и навигации в Angular, помогает студентам реализовать эффективные маршрутизацию и навигацию в приложениях, а также оптимизировать загрузку модулей и защиту данных.
