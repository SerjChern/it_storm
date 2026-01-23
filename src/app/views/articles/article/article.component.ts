import { Component, OnInit } from '@angular/core';
import {PopularArticleType} from "../../../../types/popular-article.type";
import {ArticlesService} from "../../../core/articles.service";
import {ArticleType} from "../../../../types/article.type";
import {environment} from "../../../../environments/environment";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthService} from "../../../core/auth.service";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  commentForm: FormGroup = this.fb.group({
    comment: [''],
  });
  relatedArticles: PopularArticleType[] = [];
  url: string = "";
  article: ArticleType | null = null;
  serverStaticPath = environment.serverStaticPath;
  protected isLogged: boolean = false;

  constructor(private articlesService: ArticlesService,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private authService: AuthService,) { }

  ngOnInit(): void {
    this.isLogged = this.authService.getIsLoggedIn();
    this.route.paramMap.subscribe(params => {
      this.url = params.get('url') as string;
      if(this.url){
        this.loadArticle(this.url);
      }

    });

  }
  loadArticle(url: string):void {
    this.articlesService.getArticle(url)
      .subscribe(article => {
        this.article = article;
        console.log(this.article);

        this.articlesService.getRelatedArticles(article.url)
          .subscribe((data: PopularArticleType[])=>{
            this.relatedArticles = data;
          })
      })
  }

  submitComment(): void {
    if (this.article && this.commentForm.value.comment) {
      const comment = this.commentForm.value.comment;
      this.articlesService.postComment(comment, this.article.id).subscribe(res => {
        console.log(res);
        this.commentForm.reset();
        this.loadArticle(this.article!.url);
      })
    }
  }

  likeComment(commentId: string): void {
    this.articlesService.commentActions('like', commentId).subscribe(res => {
      console.log(res);
      this.loadArticle(this.article!.url);
    })
  }

  dislikeComment(commentId: string): void {
    this.articlesService.commentActions('dislike', commentId).subscribe(res => {
      console.log(res);
      this.loadArticle(this.article!.url);
    })
  }

  violateComment(commentId: string): void {
    this.articlesService.commentActions('violate', commentId).subscribe(res => {
      console.log(res);
      this.loadArticle(this.article!.url);
    })
  }

}
