import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../../core/auth.service";
import {UserInfoType} from "../../../../types/user-info.type";
import {map, Observable} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  protected isLogged: boolean = false;
  public userName: string | null = '';
  isLogged$!: Observable<boolean>;
  constructor(private router: Router,
              private authService: AuthService) {
    this.isLogged = this.authService.getIsLoggedIn();
    this.authService.userName$.subscribe(user => {
      this.userName = user;
      console.log(this.userName);
    });
  }


  ngOnInit(): void {
    this.userName = localStorage.getItem('userName');
  }

  openLogIn(): void {
    this.router.navigate(['/login']);
  }

}
