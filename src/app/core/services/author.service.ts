import { AuthorModel } from './../models/author.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  private readonly path: string = 'author'

  constructor(
    private apiService: ApiService
  ) { }

  /**
   * Получить список всех авторов
   */
  public get(): Observable<AuthorModel[]> {
    return this.apiService.get(this.path)
  }

  /**
   * Получить автора по id
   * @param id идентификатор автора
   */
  public getById(id: string | number): Observable<AuthorModel> {
    return this.apiService.get(`${this.path}/${id}`)
  }

  /**
   * Добавить автора
   * @param author автор
   */
  public post(author: AuthorModel): Observable<any> {
    return this.apiService.post(this.path, author)
  }

  /**
   * Изменить информацию об авторе
   * @param author автор
   */
  public put(author: AuthorModel): Observable<any> {
    return this.apiService.put(this.path, author)
  }

  /**
   * Удалить автора
   * @param id идентификатор автора
   */
  public delete(id: string): Observable<any> {
    return this.apiService.delete(`${this.path}/${id}`)
  }
}
