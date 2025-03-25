| Подход                     | Преимущества                          | Недостатки                                              | Особенности                                                 |
|----------------------------|---------------------------------------|---------------------------------------------------------|-------------------------------------------------------------|
| FormControl                | Простота, контроль над каждым полем   | Менее структурировано, подходит для простых форм        | Используется для отдельных контролов                        |
| FormGroup                  | Группировка, управление группами      | Больше кода, сложнее настройка                          | Стандартный подход для сложных форм                         |
| FormBuilder                | Удобный синтаксис, сокращает код      | Требует импорта FormBuilder, может усложнить читаемость | Сокращает написание кода, особенно полезен для сложных форм |


| Характеристика                     | Шаблонные формы                           | Реактивные формы                            |
|------------------------------------|-------------------------------------------|---------------------------------------------|
| Создание формы                     | В HTML-шаблоне через ngModel              | В компоненте через FormGroup и FormControl  |
| Управление состоянием              | Автоматическое Angular                    | Явное управление в компоненте               |
| Валидация                          | Настраивается в шаблоне, ограниченная     | Гибкая, настраивается в компоненте          |
| Динамическое изменение формы       | Менее удобно и гибко                      | Удобное, легко изменять структуру           |
| Производительность                 | Подходит для простых форм                 | Подходит для сложных и больших форм         |
| Тестируемость                      | Сложнее тестировать                       | Легче тестировать                           |
| Использование в простых проектах   | Отлично подходит                          | Может быть избыточным                       |
| Использование в сложных проектах   | Может быть недостаточно гибким            | Прекрасно подходит                          |


В реактивной форме шаблон лишь отображает состояние формы.
В шаблонной логика размазана между шаблоном и компонентом.

---

# Шаблонные формы: Основы работы с шаблонными формами (ngModel)

## Введение в шаблонные формы

Шаблонные формы (Template-driven forms) в Angular — это подход к созданию форм, основанный на директивах в HTML-шаблоне. Этот подход прост в использовании и подходит для небольших и средних форм.

### Основные характеристики:
- Простота использования
- Минимум кода
- Асинхронная валидация
- Двустороннее связывание данных

## Настройка модуля форм

```typescript
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    FormsModule  // Добавляем FormsModule в imports
  ]
})
export class AppModule { }
```

## Основные директивы

### ngModel

`ngModel` — основная директива для двустороннего связывания данных:

```typescript
@Component({
  selector: 'app-user-form',
  template: `
    <input [(ngModel)]="user.name" name="userName">
    <p>Текущее значение: {{ user.name }}</p>
  `
})
export class UserFormComponent {
  user = { name: '' };
}
```

### ngForm

`ngForm` автоматически создается для каждой формы:

```html
<form #myForm="ngForm" (ngSubmit)="onSubmit(myForm)">
  <input [(ngModel)]="user.name" name="userName" required>
  <button type="submit">Отправить</button>
</form>
```

```typescript
export class UserFormComponent {
  user = { name: '' };

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log(form.value);
    }
  }
}
```

## Практические примеры

### 1. Простая форма регистрации

```typescript
@Component({
  selector: 'app-registration',
  template: `
    <form #regForm="ngForm" (ngSubmit)="onSubmit(regForm)">
      <div class="form-group">
        <label for="username">Имя пользователя</label>
        <input 
          type="text" 
          id="username"
          name="username"
          [(ngModel)]="user.username"
          required
          #username="ngModel"
          class="form-control">
        <div *ngIf="username.invalid && username.touched" class="alert alert-danger">
          Имя пользователя обязательно
        </div>
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input 
          type="email" 
          id="email"
          name="email"
          [(ngModel)]="user.email"
          required
          email
          #email="ngModel"
          class="form-control">
        <div *ngIf="email.invalid && email.touched" class="alert alert-danger">
          <div *ngIf="email.errors?.['required']">Email обязателен</div>
          <div *ngIf="email.errors?.['email']">Некорректный email</div>
        </div>
      </div>

      <button type="submit" [disabled]="regForm.invalid">
        Зарегистрироваться
      </button>
    </form>
  `
})
export class RegistrationComponent {
  user = {
    username: '',
    email: ''
  };

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Form submitted', form.value);
    }
  }
}
```

### 2. Форма с выбором опций

```typescript
@Component({
  selector: 'app-order-form',
  template: `
    <form #orderForm="ngForm" (ngSubmit)="onSubmit(orderForm)">
      <div class="form-group">
        <label for="product">Продукт</label>
        <select 
          id="product"
          name="product"
          [(ngModel)]="order.product"
          required
          class="form-control">
          <option value="">Выберите продукт</option>
          <option *ngFor="let p of products" [value]="p.id">
            {{p.name}} - {{p.price}}₽
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="quantity">Количество</label>
        <input 
          type="number"
          id="quantity"
          name="quantity"
          [(ngModel)]="order.quantity"
          required
          min="1"
          class="form-control">
      </div>

      <div class="form-group">
        <label>Способ доставки</label>
        <div *ngFor="let method of deliveryMethods">
          <input 
            type="radio"
            name="delivery"
            [value]="method.id"
            [(ngModel)]="order.deliveryMethod"
            required>
          {{method.name}} ({{method.price}}₽)
        </div>
      </div>

      <button type="submit" [disabled]="orderForm.invalid">
        Оформить заказ
      </button>
    </form>
  `
})
export class OrderFormComponent {
  products = [
    { id: 1, name: 'Товар 1', price: 100 },
    { id: 2, name: 'Товар 2', price: 200 }
  ];

  deliveryMethods = [
    { id: 1, name: 'Обычная доставка', price: 200 },
    { id: 2, name: 'Экспресс доставка', price: 500 }
  ];

  order = {
    product: '',
    quantity: 1,
    deliveryMethod: null
  };

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Заказ оформлен', form.value);
    }
  }
}
```

## Работа с состояниями формы

### Состояния полей формы

- `pristine/dirty` - было ли поле изменено
- `touched/untouched` - было ли поле в фокусе
- `valid/invalid` - валидно ли поле

```html
<input 
  [(ngModel)]="user.name" 
  name="userName"
  #userName="ngModel"
  required>

<div class="field-status">
  <p>Pristine: {{ userName.pristine }}</p>
  <p>Touched: {{ userName.touched }}</p>
  <p>Valid: {{ userName.valid }}</p>
</div>
```

### CSS-классы состояний

Angular автоматически добавляет CSS-классы:
- `ng-valid/ng-invalid`
- `ng-pristine/ng-dirty`
- `ng-touched/ng-untouched`

```css
.ng-invalid.ng-touched {
  border-color: red;
}

.ng-valid.ng-touched {
  border-color: green;
}
```

## Лучшие практики

1. **Именование полей**
   ```html
   <!-- Всегда указывайте атрибут name -->
   <input [(ngModel)]="user.name" name="userName">
   ```

2. **Группировка полей**
   ```html
   <div ngModelGroup="address">
     <input [(ngModel)]="user.street" name="street">
     <input [(ngModel)]="user.city" name="city">
   </div>
   ```

3. **Обработка ошибок**
   ```html
   <input 
     [(ngModel)]="user.email" 
     name="email"
     #email="ngModel"
     required
     email>
   
   <div *ngIf="email.invalid && email.touched">
     <div *ngIf="email.errors?.['required']">
       Email обязателен
     </div>
     <div *ngIf="email.errors?.['email']">
       Некорректный email
     </div>
   </div>
   ```

4. **Сброс формы**
   ```typescript
   onSubmit(form: NgForm) {
     if (form.valid) {
       // Обработка данных
       form.reset(); // Сброс формы
     }
   }
   ```

5. **Отслеживание изменений**
   ```typescript
   @ViewChild('myForm') myForm: NgForm;

   ngAfterViewInit() {
     this.myForm.valueChanges.subscribe(values => {
       console.log('Form values changed:', values);
     });
   }
   ```


---

# Реактивные формы: Использование FormControl, FormGroup, FormBuilder

## Введение в реактивные формы

Реактивные формы (Reactive Forms) — это подход к созданию форм, где логика и валидация определяются в компоненте, а не в шаблоне. Этот подход обеспечивает лучший контроль над формой и подходит для сложных сценариев.

### Преимущества реактивных форм:
- Более строгая типизация
- Лучшая тестируемость
- Предсказуемость поведения
- Синхронная валидация
- Простое управление динамическими формами

## Настройка

```typescript
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    ReactiveFormsModule  // Добавляем ReactiveFormsModule в imports
  ]
})
export class AppModule { }
```

## Основные классы

### 1. FormControl

```typescript
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-name-editor',
  template: `
    <input [formControl]="name">
    <p>Value: {{ name.value }}</p>
  `
})
export class NameEditorComponent {
  name = new FormControl('');
}
```

### 2. FormGroup

```typescript
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-profile-editor',
  template: `
    <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
      <input formControlName="firstName">
      <input formControlName="lastName">
      <button type="submit">Submit</button>
    </form>
  `
})
export class ProfileEditorComponent {
  profileForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl('')
  });

  onSubmit() {
    console.log(this.profileForm.value);
  }
}
```

### 3. FormBuilder

```typescript
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-profile-editor',
  template: `
    <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
      <input formControlName="firstName">
      <input formControlName="lastName">
      <div formGroupName="address">
        <input formControlName="street">
        <input formControlName="city">
      </div>
      <button type="submit">Submit</button>
    </form>
  `
})
export class ProfileEditorComponent {
  profileForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    address: this.fb.group({
      street: [''],
      city: ['']
    })
  });

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    console.log(this.profileForm.value);
  }
}
```

## Практические примеры

### 1. Регистрационная форма

```typescript
@Component({
  selector: 'app-registration',
  template: `
    <form [formGroup]="registrationForm" (ngSubmit)="onSubmit()">
      <div class="form-group">
        <label for="username">Username</label>
        <input 
          id="username"
          type="text"
          formControlName="username"
          class="form-control">
        <div *ngIf="f.username.touched && f.username.errors" class="alert alert-danger">
          <div *ngIf="f.username.errors?.['required']">Username is required</div>
          <div *ngIf="f.username.errors?.['minlength']">
            Username must be at least 3 characters
          </div>
        </div>
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input 
          id="email"
          type="email"
          formControlName="email"
          class="form-control">
        <div *ngIf="f.email.touched && f.email.errors" class="alert alert-danger">
          <div *ngIf="f.email.errors?.['required']">Email is required</div>
          <div *ngIf="f.email.errors?.['email']">Invalid email format</div>
        </div>
      </div>

      <div formGroupName="passwords" class="form-group">
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            id="password"
            type="password"
            formControlName="password"
            class="form-control">
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input 
            id="confirmPassword"
            type="password"
            formControlName="confirmPassword"
            class="form-control">
        </div>

        <div *ngIf="f.passwords.errors?.['passwordMismatch']" 
             class="alert alert-danger">
          Passwords do not match
        </div>
      </div>

      <button type="submit" 
              [disabled]="registrationForm.invalid"
              class="btn btn-primary">
        Register
      </button>
    </form>
  `
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.registrationForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      passwords: this.fb.group({
        password: ['', [
          Validators.required,
          Validators.minLength(6)
        ]],
        confirmPassword: ['', Validators.required]
      }, { validator: this.passwordMatchValidator })
    });
  }

  // Getter для удобного доступа к полям формы
  get f() {
    return this.registrationForm.controls;
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value
      ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      console.log(this.registrationForm.value);
      // Отправка данных на сервер
    }
  }
}
```

### 2. Динамические формы

```typescript
@Component({
  selector: 'app-dynamic-form',
  template: `
    <form [formGroup]="dynamicForm" (ngSubmit)="onSubmit()">
      <div formArrayName="items">
        <div *ngFor="let item of items.controls; let i=index" 
             [formGroupName]="i">
          <input formControlName="name" placeholder="Item name">
          <input formControlName="quantity" type="number" min="1">
          <button type="button" (click)="removeItem(i)">Remove</button>
        </div>
      </div>
      
      <button type="button" (click)="addItem()">Add Item</button>
      <button type="submit">Submit</button>
    </form>
  `
})
export class DynamicFormComponent {
  dynamicForm = this.fb.group({
    items: this.fb.array([])
  });

  constructor(private fb: FormBuilder) {}

  get items() {
    return this.dynamicForm.get('items') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  addItem() {
    this.items.push(this.createItem());
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  onSubmit() {
    if (this.dynamicForm.valid) {
      console.log(this.dynamicForm.value);
    }
  }
}
```

## Управление состоянием формы

### 1. Программное управление

```typescript
// Установка значений
this.profileForm.patchValue({
  firstName: 'John',
  address: {
    street: 'Main St'
  }
});

// Сброс формы
this.profileForm.reset();

// Отключение/включение контрола
this.profileForm.get('firstName').disable();
this.profileForm.get('firstName').enable();
```

### 2. Подписка на изменения

```typescript
// Подписка на изменения значений
this.profileForm.valueChanges.subscribe(value => {
  console.log('Form value changed:', value);
});

// Подписка на изменения статуса
this.profileForm.statusChanges.subscribe(status => {
  console.log('Form status changed:', status);
});
```

## Лучшие практики

1. **Типизация форм**
   ```typescript
   interface UserProfile {
     firstName: string;
     lastName: string;
     email: string;
   }

   const profileForm = this.fb.group<UserProfile>({
     firstName: [''],
     lastName: [''],
     email: ['']
   });
   ```

2. **Отдельные методы для создания форм**
   ```typescript
   private createForm(): FormGroup {
     return this.fb.group({
       // определение формы
     });
   }
   ```

3. **Переиспользуемые валидаторы**
   ```typescript
   export const passwordStrengthValidator = (control: AbstractControl): ValidationErrors | null => {
     const value = control.value;
     if (!value) return null;

     const hasUpperCase = /[A-Z]+/.test(value);
     const hasLowerCase = /[a-z]+/.test(value);
     const hasNumeric = /[0-9]+/.test(value);

     const valid = hasUpperCase && hasLowerCase && hasNumeric;
     return valid ? null : { passwordStrength: true };
   };
   ```

4. **Обработка асинхронной валидации**
   ```typescript
   export class UsernameValidator {
     static createValidator(userService: UserService) {
       return (control: AbstractControl) => {
         return userService.checkUsernameAvailability(control.value)
           .pipe(
             map(isAvailable => isAvailable ? null : { usernameTaken: true }),
             catchError(() => of(null))
           );
       };
     }
   }
   ```

5. **Компоненты для переиспользуемых форм**
   ```typescript
   @Component({
     selector: 'app-address-form',
     template: `
       <div [formGroup]="addressForm">
         <input formControlName="street">
         <input formControlName="city">
         <input formControlName="zipCode">
       </div>
     `
   })
   export class AddressFormComponent {
     @Input() addressForm: FormGroup;
   }
   ```


---

# Валидация: Встроенные и пользовательские валидаторы

## Введение в валидацию форм

Валидация форм в Angular — это механизм проверки пользовательского ввода на соответствие определенным правилам. Angular предоставляет как встроенные валидаторы, так и возможность создания пользовательских.

## Встроенные валидаторы

### 1. Основные валидаторы

```typescript
import { Validators } from '@angular/forms';

const form = this.fb.group({
  username: ['', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(20)
  ]],
  email: ['', [
    Validators.required,
    Validators.email
  ]],
  age: ['', [
    Validators.required,
    Validators.min(18),
    Validators.max(100)
  ]],
  website: ['', [
    Validators.pattern('https?://.+')
  ]]
});
```

### 2. Применение в шаблонных формах

```html
<form #myForm="ngForm">
  <input 
    name="username"
    [(ngModel)]="user.username"
    required
    minlength="3"
    maxlength="20"
    #username="ngModel">
  
  <div *ngIf="username.invalid && username.touched">
    <div *ngIf="username.errors?.['required']">
      Username is required
    </div>
    <div *ngIf="username.errors?.['minlength']">
      Username must be at least 3 characters
    </div>
  </div>
</form>
```

### 3. Применение в реактивных формах

```typescript
@Component({
  selector: 'app-reactive-form',
  template: `
    <form [formGroup]="userForm">
      <input formControlName="username">
      
      <div *ngIf="f.username.invalid && f.username.touched">
        <div *ngIf="f.username.errors?.['required']">
          Username is required
        </div>
        <div *ngIf="f.username.errors?.['minlength']">
          Username must be at least 3 characters
        </div>
      </div>
    </form>
  `
})
export class ReactiveFormComponent {
  userForm = this.fb.group({
    username: ['', [
      Validators.required,
      Validators.minLength(3)
    ]]
  });

  get f() { return this.userForm.controls; }
}
```

## Пользовательские валидаторы

### 1. Простой валидатор

```typescript
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  const isWhitespace = (control.value || '').trim().length === 0;
  return isWhitespace ? { whitespace: true } : null;
}

// Использование
const form = this.fb.group({
  username: ['', [
    Validators.required,
    noWhitespaceValidator
  ]]
});
```

### 2. Валидатор с параметрами

```typescript
export function forbiddenNameValidator(forbiddenName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = control.value.toLowerCase() === forbiddenName.toLowerCase();
    return forbidden ? { forbiddenName: { value: control.value } } : null;
  };
}

// Использование
const form = this.fb.group({
  username: ['', [
    Validators.required,
    forbiddenNameValidator('admin')
  ]]
});
```

### 3. Кросс-поле валидатор

```typescript
export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) return null;

  return password.value === confirmPassword.value 
    ? null 
    : { passwordMismatch: true };
}

// Использование
const form = this.fb.group({
  password: ['', Validators.required],
  confirmPassword: ['', Validators.required]
}, { validators: passwordMatchValidator });
```

## Асинхронная валидация

### 1. Простой асинхронный валидатор

```typescript
import { AsyncValidatorFn } from '@angular/forms';

export function uniqueUsernameValidator(userService: UserService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return userService.checkUsername(control.value).pipe(
      map(isAvailable => isAvailable ? null : { usernameTaken: true }),
      catchError(() => of(null))
    );
  };
}

// Использование
const form = this.fb.group({
  username: ['', 
    [Validators.required], 
    [uniqueUsernameValidator(this.userService)]
  ]
});
```

### 2. Валидатор с задержкой

```typescript
export function uniqueEmailValidator(userService: UserService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return timer(300).pipe(
      switchMap(() => userService.checkEmail(control.value)),
      map(isAvailable => isAvailable ? null : { emailTaken: true }),
      catchError(() => of(null))
    );
  };
}
```

## Практические примеры

### 1. Форма регистрации с комплексной валидацией

```typescript
@Component({
  selector: 'app-registration',
  template: `
    <form [formGroup]="registrationForm" (ngSubmit)="onSubmit()">
      <div class="form-group">
        <label>Username</label>
        <input formControlName="username">
        <div *ngIf="f.username.errors && f.username.touched">
          <div *ngIf="f.username.errors?.['required']">Required</div>
          <div *ngIf="f.username.errors?.['minlength']">
            Min length is {{f.username.errors?.['minlength'].requiredLength}}
          </div>
          <div *ngIf="f.username.errors?.['usernameTaken']">
            Username is already taken
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>Password</label>
        <input type="password" formControlName="password">
        <div *ngIf="f.password.errors && f.password.touched">
          <div *ngIf="f.password.errors?.['required']">Required</div>
          <div *ngIf="f.password.errors?.['passwordStrength']">
            Password must contain uppercase, lowercase and number
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>Confirm Password</label>
        <input type="password" formControlName="confirmPassword">
      </div>
      
      <div *ngIf="registrationForm.errors?.['passwordMismatch']">
        Passwords do not match
      </div>

      <button type="submit" [disabled]="registrationForm.invalid">
        Register
      </button>
    </form>
  `
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.registrationForm = this.fb.group({
      username: ['', 
        [
          Validators.required,
          Validators.minLength(3),
          noWhitespaceValidator
        ],
        [uniqueUsernameValidator(this.userService)]
      ],
      password: ['', [
        Validators.required,
        passwordStrengthValidator
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  get f() { return this.registrationForm.controls; }

  onSubmit() {
    if (this.registrationForm.valid) {
      console.log(this.registrationForm.value);
    }
  }
}
```

### 2. Динамическая валидация

```typescript
@Component({
  selector: 'app-dynamic-validation',
  template: `
    <form [formGroup]="form">
      <div class="form-group">
        <label>Account Type</label>
        <select formControlName="accountType">
          <option value="personal">Personal</option>
          <option value="business">Business</option>
        </select>
      </div>

      <div class="form-group">
        <label>Tax ID</label>
        <input formControlName="taxId">
        <div *ngIf="f.taxId.errors && f.taxId.touched">
          <div *ngIf="f.taxId.errors?.['required']">
            Tax ID is required for business accounts
          </div>
          <div *ngIf="f.taxId.errors?.['pattern']">
            Invalid Tax ID format
          </div>
        </div>
      </div>
    </form>
  `
})
export class DynamicValidationComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      accountType: ['personal'],
      taxId: ['']
    });

    // Динамическое изменение валидаторов
    this.form.get('accountType').valueChanges
      .subscribe(accountType => {
        const taxId = this.form.get('taxId');
        
        if (accountType === 'business') {
          taxId.setValidators([
            Validators.required,
            Validators.pattern(/^\d{2}-\d{7}$/)
          ]);
        } else {
          taxId.clearValidators();
        }
        
        taxId.updateValueAndValidity();
      });
  }

  get f() { return this.form.controls; }
}
```

## Лучшие практики

1. **Организация валидаторов**
   ```typescript
   // validators/index.ts
   export * from './password.validator';
   export * from './username.validator';
   export * from './email.validator';
   ```

2. **Переиспользуемые сообщения об ошибках**
   ```typescript
   export const ValidationMessages = {
     required: 'This field is required',
     email: 'Please enter a valid email',
     minlength: (params) => `Minimum length is ${params.requiredLength}`,
     passwordStrength: 'Password must meet complexity requirements'
   };
   ```

3. **Компонент для отображения ошибок**
   ```typescript
   @Component({
     selector: 'app-validation-errors',
     template: `
       <div *ngIf="control.errors && control.touched" class="error-messages">
         <div *ngFor="let error of errorMessages" class="error-message">
           {{ error }}
         </div>
       </div>
     `
   })
   export class ValidationErrorsComponent {
     @Input() control: AbstractControl;
     
     get errorMessages(): string[] {
       if (!this.control.errors) return [];
       
       return Object.keys(this.control.errors)
         .map(key => {
           const error = this.control.errors[key];
           return typeof ValidationMessages[key] === 'function'
             ? ValidationMessages[key](error)
             : ValidationMessages[key];
         });
     }
   }
   ```

4. **Валидация форм при отправке**
   ```typescript
   onSubmit() {
     if (this.form.invalid) {
       Object.keys(this.form.controls).forEach(key => {
         const control = this.form.get(key);
         if (control.invalid) {
           control.markAsTouched();
         }
       });
       return;
     }
     // Продолжить отправку формы
   }
   ```

5. **Обработка асинхронной валидации**
   ```typescript
   export class FormComponent {
     isLoading = false;

     ngOnInit() {
       this.form.statusChanges.subscribe(status => {
         this.isLoading = status === 'PENDING';
       });
     }
   }
   ```


---


ИТОГОВАЯ МЕТОДИКА ПРОВЕДЕНИЯ ЧЕТВЁРТОГО МОДУЛЯ КУРСА ПО ANGULAR (Формы и Валидация)

1. Общий обзор подходов к созданию форм
- Сравнение шаблонных (Template-driven) и реактивных (Reactive) форм:
  - Ясное разделение сценариев применения.
  - Шаблонные формы — простые и средние сценарии.
  - Реактивные формы — сложные формы и строгая типизация.

2. Шаблонные формы (Template-driven Forms)
- Основы использования и директивы (ngModel, ngForm).
- Настройка и практические примеры (регистрация, выбор опций).
- Управление состоянием формы (pristine/dirty, touched/untouched, valid/invalid).
- Рекомендуемые подходы к обработке ошибок и сбросу формы.

3. Реактивные формы (Reactive Forms)
- Глубокое понимание классов FormControl, FormGroup и FormBuilder.
- Практические примеры использования FormBuilder в сложных сценариях (динамические формы).
- Сценарии и критерии выбора между FormControl, FormGroup и FormBuilder.
  - Использование FormBuilder для сокращения кода в сложных формах.
  - Предостережения о читаемости кода и дополнительных импортах.

4. Валидация форм
- Встроенные валидаторы (Validators) и их применение в шаблонных и реактивных формах.
- Создание пользовательских валидаторов (простые, параметризованные, асинхронные, кросс-поле).
- Практическое понимание и организация асинхронной валидации.

ДОПОЛНИТЕЛЬНЫЕ ДОСМЫСЛЕНИЯ И УЛУЧШЕНИЯ В ПРОЦЕССЕ ЗАНЯТИЯ:

5. Уточнение различий между шаблонными и реактивными формами:
- Конкретизация того, как "размазана" логика в шаблонных формах и почему в реактивных формах логика сконцентрирована в компоненте.
- Рекомендации по ясному выбору подхода в зависимости от сложности и структуры формы.

6. Практический разбор преимуществ и недостатков подходов (FormControl, FormGroup, FormBuilder):
- Более детальное объяснение преимуществ FormBuilder для сложных сценариев.
- Предостережение от использования FormBuilder в простых ситуациях для сохранения читаемости и ясности кода.

7. Расширенный разбор валидации форм:
- Практические аспекты и лучшие практики организации асинхронной валидации.
- Уточнены различия и подходы к валидации в шаблонных и реактивных формах.
- Примеры реализации и рекомендации по работе с валидаторами.

ИТОГОВАЯ РАСШИРЕННАЯ СТРУКТУРА ЧЕТВЁРТОГО МОДУЛЯ:

1. Общий обзор форм:
   - Сравнение шаблонных и реактивных подходов.

2. Шаблонные формы:
   - Основы, настройка, примеры.
   - Управление состоянием и обработка ошибок.

3. Реактивные формы:
   - FormControl, FormGroup, FormBuilder.
   - Практические сценарии, рекомендации.

4. Валидация:
   - Встроенные и пользовательские валидаторы.
   - Асинхронная и кросс-поле валидация.

5. Углублённые пояснения различий подходов:
   - Конкретные сценарии и примеры использования.

6. Практические рекомендации:
   - Выбор инструментов (FormControl/FormBuilder).
   - Управление сложностью и читаемостью кода.

7. Валидация на практике:
   - Рекомендации и практические примеры.

Эта методика обеспечит студентам чёткое понимание и практические навыки работы с формами и валидацией в Angular, позволит избежать распространенных ошибок и оптимизировать процесс разработки.
