import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {LoginResponseType} from "../../../../types/login-response.type";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  protected signupForm = this.fb.group({
    name: ['', [Validators.required,
      Validators.pattern(/^([А-ЯЁ][а-яё]+)(\s[А-ЯЁ][а-яё]+)*$/)]],
    email: ['', [Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
    password: ['', [Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])\S{8,}$/)]],
    agree: [false, [Validators.required]],
  });
  protected _router = this.router;
  constructor(private readonly fb: FormBuilder,
              private readonly authService: AuthService,
              private readonly _snackBar: MatSnackBar,
              private readonly router: Router,) { }

  protected signup(): void {
    const { name, email, password, agree } = this.signupForm.getRawValue();
    if (this.signupForm.valid && email && password && name && agree) {
      this.authService.signup(name, email, password)
        .subscribe({
          next: (data: DefaultResponseType | LoginResponseType) => {
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

            this.authService.getUserInfo()

            //set tokens
            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.userId = loginResponse.userId;
            this._snackBar.open('Вы успешно зарегистрировались','', {duration: 3000});
            this.router.navigate(['/']);
          },
          error: (errorResponse: HttpErrorResponse) => {
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
