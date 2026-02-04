import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {LoginResponseType} from "../../../../types/login-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {UserInfoType} from "../../../../types/user-info.type";
import {BehaviorSubject, Observable} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    email: ['', [Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

  protected userNameKey: string = 'userName';
  private userName = new BehaviorSubject<string>('');

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  protected login() {
    const { email, password, rememberMe } = this.loginForm.getRawValue();
    if (this.loginForm.valid && email && password) {
      this.authService.login(email, password, !!rememberMe)
        .subscribe({
          next: (data: LoginResponseType | DefaultResponseType)=> {
            let error = null;
            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
            }

            const loginResponse = data as LoginResponseType;
            if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
              error = 'Auth error';
            }

            if (error) {
              this._snackBar.open(error);
              throw new Error(error);
            }


            //set tokens
            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.userId = loginResponse.userId;
            this._snackBar.open('Вы успешно авторизовались', '', {duration: 3000});
            this.authService.loadUserInfo();
            this.router.navigate(['/']);

          },
          error:(errorResponse: HttpErrorResponse) => {
            if(errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Auth error');
            }
          }
        });
    }
  }

}
