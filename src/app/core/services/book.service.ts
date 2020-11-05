import { BookModel } from './../models/book.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private readonly path: string = 'book'

  constructor(
    private apiService: ApiService
  ) { }

  /**
   * Получить список всех книг
   */
  public get(): Observable<BookModel[]> {
    return this.apiService.get(this.path)
  }

  /**
   * Получить книгу по ISBN
   * @param isbn уникальный номер книги
   */
  public getByIsbn(isbn: string): Observable<BookModel> {
    return this.apiService.get(`${this.path}/${isbn}`)
  }

  /**
   * Получить книги определенной категории
   * @param id идентификатор категории
   */
  public getByCategoryId(id: number): Observable<BookModel[]> {
    return this.apiService.get(`${this.path}/category/${id}`)
  }

  /**
   * Добавить книгу
   * @param book книга
   */
  public post(book: BookModel): Observable<any> {
    return this.apiService.post(this.path, book)
  }

  /**
   * Изменить книгу
   * @param book книга
   */
  public put(book: BookModel): Observable<any> {
    return this.apiService.put(this.path, book)
  }

  /**
   * Удалить книгу
   * @param isbn уникальный номер книги
   */
  public delete(isbn: string): Observable<any> {
    return this.apiService.delete(`${this.path}/${isbn}`)
  }
}
