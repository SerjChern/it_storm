import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {BannerType} from "../../../types/banner.type";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../core/auth.service";
import {CategoriesType} from "../../../types/categories.type";
import {ServiceType} from "../../../types/service.type";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 24,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false
  };
  banners: BannerType[] = [
    {
      header: 'Предложение месяца',
      text: 'Продвижение в Instagram для вашего бизнеса <span>-15%</span>!',
      image: 'banner-1.png'
    },
    {
      header: 'Акция',
      text: 'Нужен грамотный <span>копирайтер</span>?',
      subText: 'Весь декабрь у нас действует акция на работу копирайтера.',
      image: 'banner-2.png'
    },
    {
      header: 'Новость дня',
      text: '<span>6 место</span> в ТОП-10 SMM-агенств Москвы!',
      subText:'Мы благодарим каждого, кто голосовал за нас!',
      image: 'banner-3.png'
    }
  ]
  services: ServiceType[] = [
    {
      header: 'Создание сайтов',
      text: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: '7500',
      image: 'seervice-1.png'
    },
    {
      header: 'Продвижение',
      text: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: '3500',
      image: 'service-2.png'
    },
    {
      header: 'Реклама',
      text: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      price: '1000',
      image: 'service-3.png'
    },
    {
      header: 'Копирайтинг',
      text: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: '750',
      image: 'service-4.png'
    },
  ]
  @ViewChild('callback_popup')callBack!: TemplateRef<ElementRef>;
  @ViewChild('callback_confirmation')callBackConf!: TemplateRef<ElementRef>;

  private dialogRefCallBack: MatDialogRef<any> | null = null;
  private dialogRefCallBackConf: MatDialogRef<any> | null = null;

  protected submitRequestError: boolean = false;

  callbackForm = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
  });

  categories: CategoriesType[] = [];
  constructor(private dialog: MatDialog,
              private fb: FormBuilder,
              private authService: AuthService,) { }



  ngOnInit(): void {
    this.authService.getCategories()
      .subscribe((data: CategoriesType[])=>{
        if (data){
          this.categories = data;
          console.log(this.categories);
        }
      });
  }

  openCallBackForm(){
    this.dialogRefCallBack = this.dialog.open(this.callBack);
    this.dialogRefCallBack!.backdropClick()
      .subscribe(() => {
      });
  }

  closeDialog(){
    this.dialogRefCallBackConf?.close();
    this.dialogRefCallBack?.close();
  }

  submitOrder(service: string,){
    if (this.callbackForm.value.name && this.callbackForm.value.phone){
      this.authService.requestService(this.callbackForm.value.name, this.callbackForm.value.phone, service, 'order')
        .subscribe({
          next: (result) => {
            this.dialogRefCallBack?.close();
            this.dialogRefCallBackConf = this.dialog.open(this.callBackConf);
            this.dialogRefCallBackConf!.backdropClick().subscribe(() => {});
            this.submitRequestError = false;
          },
          error: (err) => {
            this.dialogRefCallBack?.close();
            this.dialogRefCallBackConf = this.dialog.open(this.callBackConf);
            this.dialogRefCallBackConf!.backdropClick().subscribe(() => {});
            console.error('Request failed:', err);
            this.submitRequestError = true;
          }
        });
    }
  }


}
