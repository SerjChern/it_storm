import {Component, Input, OnInit} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {PopularArticleType} from "../../../../types/popular-article.type";

@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent {

  @Input() article!: PopularArticleType;
  protected readonly serverStaticPath = environment.serverStaticPath;

}
