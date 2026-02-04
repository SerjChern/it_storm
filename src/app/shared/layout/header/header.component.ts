import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Observable, Subject, takeUntil} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  protected isLogged: boolean = false;
  public userName: string | null = '';
  protected logoutOpen : boolean = false;
  protected isLogged$: Observable<boolean> = this.authService.isLogged$;
  private destroy$ = new Subject<void>();
  private userNameKey: string = 'userName'

  constructor(private readonly authService: AuthService,
              private readonly _matSnackBar: MatSnackBar,
              private readonly router: Router,) {
    this.authService.userName$.subscribe(user => {
      this.userName = user;
    });
    this.userName = localStorage.getItem(this.userNameKey);
  }

  public ngOnInit(): void {
    this.authService.isLogged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
      this.isLogged = value;
    })
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected openLogoutDialog(): void {
    if (this.isLogged) {
      this.logoutOpen = !this.logoutOpen;
    } else {
      this.router.navigate(['login']);
    }
  }

  protected performLogout(): void {
    this.authService.logout().subscribe(data => {
      this.authService.removeTokens();
      this._matSnackBar.open(data.message);
      this.logoutOpen = false;
      this.router.navigate(['/']);
    })
  }

}
