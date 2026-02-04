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
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoaderService} from "../../../shared/services/loader.service";

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
  protected url: string = "";
  protected article?: ArticleType;
  protected readonly serverStaticPath = environment.serverStaticPath;
  protected isLogged: boolean = false;
  private destroy$ = new Subject<void>();
  private extraCommentsOffset: number = 3;
  protected hasMoreComments: boolean = false;
  private isLoadingComments: boolean = false;
  private readonly _commentsState: Map<string, string> = new Map<string, string>();

  constructor(private readonly articlesService: ArticlesService,
              private readonly route: ActivatedRoute,
              private readonly fb: FormBuilder,
              private readonly authService: AuthService,
              private readonly _snackBar: MatSnackBar,
              private readonly loaderService: LoaderService,) { }

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


  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected loadArticle(url: string):void {
    this.articlesService.getArticle(url)
      .subscribe(article => {
        this.article = article;
        this.getCommentsState(this.article.id);

        this.articlesService.getRelatedArticles(article.url)
          .subscribe((data: PopularArticleType[])=>{
            this.relatedArticles = data;
          })

        if (this.article.comments ){
          this.hasMoreComments = this.article.commentsCount > 3;
        }
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
      if (!response.error && this.article != null) {
        this.getCommentsState(this.article.id);
        this._snackBar.open('Ваш голос учтен');
      } else {
        throw Error(response.message);
      }
    })
  }

  protected dislikeComment(commentId: string): void {
    this.articlesService.commentActions('dislike', commentId).subscribe(response => {
      if (!response.error && this.article != null) {
        this.getCommentsState(this.article.id);
        this._snackBar.open('Ваш голос учтен');
      } else {
        throw Error(response.message);
      }
    })
  }

  protected violateComment(commentId: string): void {
    this.articlesService.commentActions('violate', commentId).subscribe({
        next: response => {
          if (!response.error && this.article != null) {
            this.getCommentsState(this.article.id);
            this._snackBar.open('Жалоба отправлена');
          }
        },
        error: (error: HttpErrorResponse) => {
          this._snackBar.open(error.error.message);
        }
      })
  }

  protected getCommentsState(articleId: string): void {
    this.articlesService.getCommentsState(articleId).subscribe(response => {
      if (Array.isArray(response) && this.article != null) {
        const comments = response as CommentsStateType[];
        comments.forEach(comment => {
          this._commentsState.set(comment.comment, comment.action)
        })
        this.article.comments?.forEach(comment => {
          const action = this._commentsState.get(comment.id);
          if (action) {
            comment.appliedAction = action;
          }
        });
      }
    })
  }

  protected loadMoreComments(): void {
    if (!this.hasMoreComments || this.isLoadingComments || this.article == null) {
      return;
    }

    this.loaderService.show();
    this.articlesService.getComments(this.extraCommentsOffset.toString(), this.article.id).subscribe(comments => {
      this.extraComments = comments;
      if (this.extraComments.allCount && this.extraComments.allCount > 3) {
        this.extraCommentsOffset += 10;
      }
      if (this.article == null) {
        return;
      }
      this.article.comments?.push(...this.extraComments.comments);
      this.hasMoreComments = this.extraComments.comments.length === 10;
      this.isLoadingComments = false;
      this.loaderService.hide();
    })
  }

}
