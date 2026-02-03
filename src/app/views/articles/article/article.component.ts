import {Component, OnDestroy, OnInit} from '@angular/core';
import {PopularArticleType} from "../../../../types/popular-article.type";
import {ArticlesService} from "../../../core/articles.service";
import {ArticleType} from "../../../../types/article.type";
import {environment} from "../../../../environments/environment";
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthService} from "../../../core/auth.service";
import {Subject, takeUntil} from "rxjs";
import {CommentsType} from "../../../../types/comments.type";
import {CommentsStateType} from "../../../../types/comments-state.type";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit, OnDestroy {

  protected commentForm: FormGroup = this.fb.group({
    comment: [''],
  });
  protected extraComments!: CommentsType;
  protected relatedArticles: PopularArticleType[] = [];
  protected commentsState: CommentsStateType[] = [];
  protected url: string = "";
  protected article!: ArticleType;
  protected serverStaticPath = environment.serverStaticPath;
  protected isLogged: boolean = false;
  private destroy$ = new Subject<void>();
  private extraCommentsOffset: number = 3;
  protected hasMoreComments: boolean = true;
  private isLoadingComments: boolean = false;

  constructor(private readonly articlesService: ArticlesService,
              private readonly route: ActivatedRoute,
              private readonly fb: FormBuilder,
              private readonly authService: AuthService,) { }

  public ngOnInit(): void {
    this.authService.isLogged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.isLogged = value;
      })
    this.route.paramMap.subscribe(params => {
      this.url = params.get('url') as string;
      if(this.url){
        this.loadArticle(this.url);
      }
    });
    this.getCommentsState(this.article.id);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected loadArticle(url: string):void {
    this.articlesService.getArticle(url)
      .subscribe(article => {
        this.article = article;

        this.articlesService.getRelatedArticles(article.url)
          .subscribe((data: PopularArticleType[])=>{
            this.relatedArticles = data;
          })
      })
  }

  protected submitComment(): void {
    if (this.article && this.commentForm.value.comment) {
      const comment = this.commentForm.value.comment;
      this.articlesService.postComment(comment, this.article.id).subscribe(res => {
        this.commentForm.reset();
        this.loadArticle(this.article!.url);
      })
    }
  }

  protected likeComment(commentId: string): void {
    this.articlesService.commentActions('like', commentId).subscribe(response => {
      if (!response.error){
        this.loadArticle(this.article!.url);
        this.getCommentsState(this.article.id);
      } else {
        throw Error(response.message);
      }
    })
  }

  protected dislikeComment(commentId: string): void {
    this.articlesService.commentActions('dislike', commentId).subscribe(response => {
      if (!response.error){
        this.loadArticle(this.article!.url);
        this.getCommentsState(this.article.id);
      } else {
        throw Error(response.message);
      }
    })
  }

  protected violateComment(commentId: string): void {
    this.articlesService.commentActions('violate', commentId).subscribe(response => {
      if (!response.error){
        this.loadArticle(this.article!.url);
        this.getCommentsState(this.article.id);
      } else {
        throw Error(response.message);
      }
    })
  }

  protected getCommentsState(articleId: string): void {
    this.articlesService.getCommentsState(articleId).subscribe(response => {
      this.commentsState = response as CommentsStateType[];
      const stateMap = new Map<string, string>(
        this.commentsState.map(s => [s.comment, s.action])
      );

      this.article.comments?.forEach(comment => {
        const action = stateMap.get(comment.id);
        if (action) {
          comment.appliedAction = action;
        }
      });
    })
  }

  protected loadMoreComments(): void {
    if (!this.hasMoreComments || this.isLoadingComments) {
      return;
    }

    this.articlesService.getComments(this.extraCommentsOffset.toString(), this.article.id).subscribe(comments => {
      this.extraComments = comments;
      if (this.extraComments.allCount && this.extraComments.allCount > 3) {
        this.extraCommentsOffset += 10;
      }
      this.article.comments?.push(...this.extraComments.comments);
      this.hasMoreComments = this.extraComments.comments.length === 10;
      this.isLoadingComments = false;
    })
  }

}
