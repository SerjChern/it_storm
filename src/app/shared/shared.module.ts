import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import {RouterLinkWithHref, RouterOutlet} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import { BannerCardComponent } from './components/banner-card/banner-card.component';
import { ServiceCardComponent } from './components/service-card/service-card.component';
import { ArticleCardComponent } from './components/article-card/article-card.component';
import { FeedbackCardComponent } from './components/feedback-card/feedback-card.component';
import {MatInputModule} from "@angular/material/input";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import { LoaderComponent } from './components/loader/loader.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";


@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    BannerCardComponent,
    ServiceCardComponent,
    ArticleCardComponent,
    FeedbackCardComponent,
    LoaderComponent,
  ],
  exports: [
    BannerCardComponent,
    ServiceCardComponent,
    ArticleCardComponent,
    FeedbackCardComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLinkWithHref,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ]
})
export class SharedModule { }
