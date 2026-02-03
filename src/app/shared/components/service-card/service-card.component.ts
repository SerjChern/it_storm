import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ServiceType} from "../../../../types/service.type";

@Component({
  selector: 'service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss']
})
export class ServiceCardComponent implements OnInit {

  @Input() service!: ServiceType;
  @Output() openForm = new EventEmitter<void>();
  protected serviceImgPath: string = '/assets/images/service-cards/';
  constructor() { }

  ngOnInit(): void {
  }

  openCallBackForm(){
    this.openForm.emit();
  }

}
