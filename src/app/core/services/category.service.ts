import { CategoryModel } from './../models/category.model';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly path: string = 'category'

  constructor(
    private apiService: ApiService
  ) { }

  /**
   * Получить список всех категорий
   */
  public get(): Observable<CategoryModel[]> {
    return this.apiService.get(this.path)
  }

  /**
   * Получить категорию по id
   * @param id идентификатор категории
   */
  public getById(id: string | number): Observable<CategoryModel> {
    return this.apiService.get(`${this.path}/${id}`)
  }

  /**
   * Добавить категорию
   * @param category категория
   */
  public post(category: CategoryModel): Observable<any> {
    return this.apiService.post(this.path, category)
  }

  /**
   * Изменить категорию
   * @param category категория
   */
  public put(category: CategoryModel): Observable<any> {
    return this.apiService.put(this.path, category)
  }

  /**
   * Удалить категорию
   * @param id идентификатор категории
   */
  public delete(id: string | number): Observable<any> {
    return this.apiService.delete(`${this.path}/${id}`)
  }
}
