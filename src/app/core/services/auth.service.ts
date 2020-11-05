import { NewUserModel, UserActivationModel } from './../models/user.model';
import { LoginModel } from './../models/login.model';
import { AuthModel } from './../models/auth.model';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly JWT_TOKEN_KEY: string = 'jwtToken';
  private readonly REFRESH_TOKEN_KEY: string = 'refreshToken';
  private readonly path: string = 'user';

  private user: BehaviorSubject<UserModel> = new BehaviorSubject(null);

  constructor(
    private apiService: ApiService
  ) { }

  private setLoginUser(tokens: AuthModel) {
    this.storeTokens(tokens);
    this.getAccount().subscribe();
  }

  private storeTokens(tokens: AuthModel) {
    localStorage.setItem(this.JWT_TOKEN_KEY, tokens.jwtToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  private setLogoutUser() {
    this.user.next(null);
    this.removeTokens();
  }

  private removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Вход в учетную запись
   * @param data данные для входа
   */
  public login(data: LoginModel): Observable<AuthModel> {
    return this.apiService.post(`${this.path}/token`, data).pipe(
      tap((res: AuthModel) => {
        this.setLoginUser(res);
      })
    );
  }

  /**
   * Обновить JWT по рефреш-токену
   * @param refreshToken рефреш-токен
   */
  public refreshTokens(): Observable<AuthModel> {
    let body = {
      refreshToken: localStorage.getItem(this.JWT_TOKEN_KEY)
    }
    return this.apiService.put(`${this.path}/token`, body).pipe(
      tap((res: AuthModel) => {
        this.setLoginUser(res);
      })
    );
  }

  /**
   * Выполнить выход из учетной записи
   */
  public logout() {
    this.setLogoutUser();
  }

  /**
   * Получить информацию об аккаунте из АПИ
   */
  public getAccount(): Observable<UserModel> {
    return this.apiService.get(`${this.path}/account`)
      .pipe(
        tap((user: UserModel) => {
          this.user.next(user)
        })
      );
  }

  /**
   * Зарегистрировать пользователя
   * @param user данные пользователя
   */
  public register(user: NewUserModel): Observable<any> {
    return this.apiService.post(`${this.path}/account`, user);
  }

  /**
   * Изменить аккаунт
   * @param user данные пользователя
   */
  public changeAccount(user: NewUserModel): Observable<any> {
    return this.apiService.put(`${this.path}/account`, user);
  }

  /**
   * Активация аккаунта.
   * @param body данные для активации
   */
  public activateAccount(body: UserActivationModel): Observable<any> {
    return this.apiService.put(`${this.path}/account/activate`, body)
  }

  /**
   * Отправить код активации на почту
   * @param email почта
   */
  public postActivationCode(email: string): Observable<any> {
    return this.apiService.post(`${this.path}/account/activate/${email}`)
  }

  /**
   * Удалить аккаунт
   */
  public deleteAccount(): Observable<any> {
    return this.apiService.delete(`${this.path}/account`).pipe(
      tap(() => {
        this.setLogoutUser();
      })
    );
  }



  //#region работа с данными сервиса
  /**
   * Смотреть за текущим пользователем. Меняется при входе/выходе.
   */
  public watchUser(): Observable<UserModel> {
    return this.user.asObservable();
  }

  /**
   * Получить информацию о текущем пользователе (сохраненном в сервисе)
   */
  public getUser(): UserModel {
    return { ...this.user.value };
  }

  /**
   * Авторизован ли пользователь
   */
  public isLoggedIn(): boolean {
    return this.user.value != null ? true : false;
  }
  //#endregion
}
