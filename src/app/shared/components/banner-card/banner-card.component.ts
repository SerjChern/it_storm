import {Component, Input, OnInit, Output} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {BannerType} from "../../../../types/banner.type";
import {EventEmitter} from "@angular/core";

@Component({
  selector: 'app-banner-card',
  templateUrl: './banner-card.component.html',
  styleUrls: ['./banner-card.component.scss']
})
export class BannerCardComponent implements OnInit {
  @Input() banner!: BannerType;

  @Output() openForm = new EventEmitter<void>();
  protected bannerImgPath = environment.bannerImgPath;
  constructor() { }

  ngOnInit(): void {
  }

  openCallBackForm(){
    this.openForm.emit();
  }

}
