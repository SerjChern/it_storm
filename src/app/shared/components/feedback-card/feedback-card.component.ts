import {Component, Input, OnInit} from '@angular/core';
import {FeedbackType} from "../../../../types/feedback.type";

@Component({
  selector: 'feedback-card',
  templateUrl: './feedback-card.component.html',
  styleUrls: ['./feedback-card.component.scss']
})
export class FeedbackCardComponent implements OnInit {
  @Input() feedback!: FeedbackType;
  protected feedbackImgPath: string = 'assets/images/feedback/';
  constructor() { }

  ngOnInit(): void {
  }

}
