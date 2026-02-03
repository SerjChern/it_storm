import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {SignupComponent} from "./signup/signup.component";
import {AgreementComponent} from "./agreement/agreement.component";
import {NotAuthGuard} from "../../core/guards/not-auth.guard";

const routes: Routes = [
  {path: 'login', component: LoginComponent, canActivate: [NotAuthGuard]},
  {path: 'signup', component: SignupComponent, canActivate: [NotAuthGuard]},
  {path: 'agreement', component: AgreementComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
