import {Component, Input, OnInit} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {PopularArticleType} from "../../../../types/popular-article.type";
import {Router} from "@angular/router";

@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent implements OnInit {

  @Input() article!: PopularArticleType;
  serverStaticPath = environment.serverStaticPath;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  openArticle(url: string): void {
    this.router.navigate(['/article/' + url]);
  }

}
