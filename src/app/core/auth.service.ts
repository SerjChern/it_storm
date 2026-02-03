import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, tap, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {DefaultResponseType} from "../../types/default-response.type";
import {LoginResponseType} from "../../types/login-response.type";
import {UserInfoType} from "../../types/user-info.type";
import {CategoriesType} from "../../types/categories.type";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public accessTokenKey: string = 'accessToken';
  public refreshTokenKey: string = 'refreshToken';
  public userNameKey: string = 'userName';
  public userIdKey: string = 'userId';
  public userName$ = new BehaviorSubject<string>('');
  private isLoggedSubject = new BehaviorSubject<boolean>(
    !!localStorage.getItem(this.accessTokenKey)
  );
  public isLogged$ = this.isLoggedSubject.asObservable();
  constructor(private readonly http: HttpClient) {
  }




  public login(email: string, password: string, rememberMe: boolean): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'login',
      {email, password, rememberMe})
      .pipe(
        tap(response => {
        if ((response as LoginResponseType).accessToken  && (response as LoginResponseType).refreshToken) {
          this.isLoggedSubject.next(true);
        }
      })
    );
  }

  public signup(name: string, email: string, password: string): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'signup',
      {name, email, password});
  }

  public getUserInfo(): Observable<DefaultResponseType | UserInfoType> {
    return this.http.get<DefaultResponseType | UserInfoType>(environment.api + 'users') as Observable<DefaultResponseType | UserInfoType>;
  }

  public getCategories(): Observable<CategoriesType[]> {
    return this.http.get<CategoriesType[]>(environment.api + 'categories');
  }

  public requestService(name: string, phone: string, service: string, type: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests', {name, phone, service, type});
  }

  public loadUserInfo(): void {
    this.getUserInfo().subscribe({
      next: (info) => {
        const user = info as UserInfoType;
        if (user?.name) {
          localStorage.setItem(this.userNameKey, user.name);
        }
        this.userName$.next(user.name);  // broadcast to all components
      },
      error: () => {
        this.userName$.next('');
      }
    });
  }

  public logout(): Observable<DefaultResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType>(environment.api + 'logout',
        {refreshToken: tokens.refreshToken})
        .pipe(
          tap(() => {
            this.removeTokens();
            this.isLoggedSubject.next(false);
          })
        );
    }
    throw throwError(()=> 'Can not found token');
  }

  public refresh(): Observable<DefaultResponseType | LoginResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'refresh',
        {refreshToken: tokens.refreshToken});
    }
    throw throwError(()=> 'Can not refresh token');
  }

  public setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  public removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  public getTokens():{accessToken: string | null, refreshToken: string | null} {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey)
    };
  }

  get userId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  set userId(id: string | null){
    if (id){
      localStorage.setItem(this.userIdKey, id);
    } else {
      localStorage.removeItem(this.userIdKey);
    }
  }

}
