import { AuthorModel } from './../models/author.model';
import { BookModel } from './../models/book.model';
import { CategoryModel } from './../models/category.model';
import { UserModel } from './../models/user.model';
import { LoginModel } from './../models/login.model';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, of, pipe, throwError } from 'rxjs';
import { delay, dematerialize, materialize, mergeMap } from 'rxjs/operators';
import { AuthModel } from '../models/auth.model';

let USERS = [
  {
    id: 12345,
    email: "admin@test.ru",
    password: '123456',
    name: 'Тестовый админ',
    role: 1,
    jwtToken: 'jwt-token-mock-admin',
    refreshToken: 'refresh-token-mock-admin'
  },
  {
    id: 67890,
    email: "user@test.ru",
    password: '12345678',
    name: 'Тестовый пользователь',
    role: 0,
    jwtToken: 'jwt-token-mock-user',
    refreshToken: 'jwt-token-mock-user'
  }
];

let AUTHORS: AuthorModel[] = [
  {
    id: 1,
    lastName: 'Горький',
    firstName: 'Максим'
  },
  {
    id: 2,
    lastName: 'Пушкин',
    firstName: 'Александр',
    patronymic: 'Сергеевич'
  },
  {
    id: 3,
    lastName: 'Лермонтов',
    firstName: 'Михаил',
    patronymic: 'Юрьевич'
  },
  {
    id: 4,
    lastName: 'Дзержинский',
    firstName: 'Феликс',
    patronymic: 'Эдмундович'
  },
]

let CATEGORIES: CategoryModel[] = [
  {
    id: 1,
    name: 'Романы'
  },
  {
    id: 2,
    name: 'Исторические романы',
    parentCategoryId: 1
  },
  {
    id: 3,
    name: 'Романы в стихах',
    parentCategoryId: 1
  },
  {
    id: 4,
    name: 'Повести',
  },
  {
    id: 5,
    name: 'Рассказы',
  },
  {
    id: 6,
    name: 'Пьесы',
  },
  {
    id: 7,
    name: 'Биографии и мемуары'
  }
]

let BOOKS: BookModel[] = [
  {
    id: 1,
    isbn: '978-5-17-036272-2',
    name: 'Капитанская дочка',
    description: 'Исторический роман, действие которого происходит во время восстания Емельяна Пугачева',
    authorId: 2,
    categoryId: 2
  },
  {
    id: 2,
    isbn: '978-5-373-00641-5',
    name: 'Евгений Онегин',
    description: 'Роман в стихах. Одно из самых значительных произведений русской словестности.',
    authorId: 2,
    categoryId: 3
  },
  {
    id: 3,
    isbn: '978-5-17-036272-3',
    name: 'Дубровский',
    description: 'Наиболее известный разбойничий роман на русском языке.',
    authorId: 2,
    categoryId: 1
  },
  {
    id: 4,
    isbn: '5-699-07922-Х',
    name: 'Старуха Изергиль',
    description: 'Рассказ Максима Горькова, написанный в 1894 году, состоящий из 3 частей.',
    authorId: 1,
    categoryId: 5
  },
  {
    id: 5,
    isbn: '5-699-07922-1',
    name: 'На дне',
    description: 'Пьеса Максима Горькова, написанная в конце 1901 - начале 1902 года.',
    authorId: 1,
    categoryId: 6
  },
  {
    id: 6,
    isbn: '5-17-023220-9',
    name: 'Герой нашего времени',
    description: 'Этот роман - одна из вершин русской прозы первой половины 19 века.',
    authorId: 3,
    categoryId: 1
  },
  {
    id: 7,
    isbn: '5-17-023220-8',
    name: 'Княгиня Лиговская',
    description: 'Незавершенный социально-психологический роман с элементами советской повести.',
    authorId: 3,
    categoryId: 1
  },
  {
    id: 8,
    isbn: '978-5-373-00641-7',
    name: 'Стационарный смотритель',
    description: 'Повесть А.С. Пушкина из цикла Повестей покойного Ивана Петровича Белкина',
    authorId: 2,
    categoryId: 4
  },
  {
    id: 9,
    isbn: '978-5-4475-0740-4',
    name: 'Дневник заключенного. Письма',
    description: 'В книгу включены тюремные дневники и письма выдающегося деятеля КПСС и Советского государства Ф.Э.Дзержинского, воспоминания тех, кто близко знал рыцаря революции, а также несколько рассказов писателя Юрия Германа о Дзержинском.',
    authorId: 4,
    categoryId: 7
  },
]

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const { url, method, headers, body } = request;

    return of(null)
      .pipe(
        mergeMap(handleRoute),
        materialize(),
        delay(500),
        dematerialize()
      )

    function handleRoute(): Observable<HttpEvent<unknown>> {
      switch (true) {
        case url.endsWith('/user/token') && method === 'POST':
          return login();
        case url.endsWith('/user/account') && method === 'GET':
          return account();

        case url.endsWith('/book') && method === 'GET':
          return getBooks();
        case url.endsWith('/book') && method === 'POST':
          return postBook();
        case url.endsWith('/book') && method === 'PUT':
          return putBook();
        case url.includes('/book/') && method === 'GET':
          return getBook();
        case url.includes('/book/') && method === 'DELETE':
          return deleteBook();

        case url.endsWith('/category') && method === 'GET':
          return getCategories();
        case url.endsWith('/category') && method === 'POST':
          return postCategory();
        case url.endsWith('/category') && method === 'PUT':
          return putCategory();
        case url.includes('/category/') && method === 'GET':
          return getCategory();
        case url.includes('/category/') && method === 'DELETE':
          return deleteCategory();


        case url.endsWith('/author') && method === 'GET':
          return getAuthors();
        case url.includes('/author/') && method === 'GET':
          return getAuthor();

        default:
          return next.handle(request);
      }
    }

    //#region BOOKS functions
    function getBook() {
      let isbn = url.slice(url.lastIndexOf('/') + 1);
      let book = BOOKS.find(b => b.isbn === isbn);
      if (!book) {
        return error('Книга не найдена');
      }
      return ok(book);
    }

    function getBooks() {
      return ok(JSON.parse(JSON.stringify(BOOKS)))
    }

    function postBook() {
      let book: BookModel = JSON.parse(<string>body);
      book.id = Math.max.apply(null, BOOKS.map(b => b.id));
      BOOKS.push(book);
      return ok();
    }

    function putBook() {
      let book: BookModel = JSON.parse(<string>body);
      let bi = BOOKS.findIndex(b => b.id === book.id)
      if (!bi) {
        return error('Не удалось найти книгу');
      }
      BOOKS[bi] = book;
      return ok();
    }

    function deleteBook() {
      let isbn = url.slice(url.lastIndexOf('/') + 1);
      let bi = BOOKS.findIndex(b => b.isbn === isbn);
      if (!bi) {
        return error('Не удалось найти книгу');
      }
      BOOKS.splice(bi, 1);
      return ok();
    }
    //#endregion

    //#region CATEGORIES
    function getCategory() {
      let id = parseInt(url.slice(url.lastIndexOf('/') + 1));
      let cat = CATEGORIES.find(c => c.id === id);
      if (!cat) {
        return error('Категория не найдена');
      }
      return ok(cat);
    }
    function getCategories() {
      return ok(JSON.parse(JSON.stringify(CATEGORIES)))
    }
    function postCategory() {
      return ok();
    }
    function putCategory() {
      return ok();
    }
    function deleteCategory() {
      let id = parseInt(url.slice(url.lastIndexOf('/') + 1));
      if (CATEGORIES.findIndex(c => c.id == id) < 0) {
        return error('Категория не найдена')
      }
      let catsIds = CATEGORIES.filter(cat => cat.parentCategoryId && cat.parentCategoryId == id).map(cat => cat.id);
      catsIds.push(id);
      for (let i of catsIds) {
        BOOKS = BOOKS.filter(book => book.categoryId != i);
      }
      CATEGORIES = CATEGORIES.filter(cat => cat.parentCategoryId != id);
      CATEGORIES = CATEGORIES.filter(cat => cat.id != id);
      return ok();
    }
    //#endregion

    //#region AUTHORS
    function getAuthor() {
      let id = Number(url.slice(url.lastIndexOf('/') + 1));
      let author = AUTHORS.find(a => a.id === id);
      if (!author) {
        return error('Автор не найден');
      }
      return ok(author);
    }
    function getAuthors() {
      return ok(JSON.parse(JSON.stringify(AUTHORS)))
    }
    //#endregion

    function account() {
      let token = headers.get('Authorization')
      let user = USERS.find(x => `Bearer ${x.jwtToken}` == token)
      if (!user) {
        error('Что-то пошло не так')
      }
      let res: UserModel = {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        role: user.role
      }
      return ok(res);
    }

    function login() {
      let login: LoginModel = JSON.parse(<string>body);

      let user = USERS.find(x => x.email == login.email && x.password == login.password);
      if (!user) {
        return error('Пользователь с таким логином/паролем не найден.')
      }

      let response: AuthModel = {
        jwtToken: user.jwtToken,
        refreshToken: user.refreshToken
      }
      return ok(response);
    }


    function ok(body?) {
      return of(new HttpResponse({ status: 200, body }))
    }

    function error(message) {
      return throwError({ error: { message } });
    }
  }
}
