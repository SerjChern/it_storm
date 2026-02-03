import { Injectable } from '@angular/core';
import {PopularArticleType} from "../../types/popular-article.type";
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {ParamsType} from "../../types/params.type";
import {ArticleType} from "../../types/article.type";
import {ResponseType} from "../../types/response.type";
import {CommentsType} from "../../types/comments.type";
import {DefaultResponseType} from "../../types/default-response.type";
import {CommentsStateType} from "../../types/comments-state.type";

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private readonly http: HttpClient) { }

  public getPopularArticles(): Observable<PopularArticleType[]> {
    return this.http.get<PopularArticleType[]>(environment.api + 'articles/top');
  }

  public getRelatedArticles(url: string): Observable<PopularArticleType[]> {
    return this.http.get<PopularArticleType[]>(environment.api + 'articles/related/' + url);
  }

  public getArticle(url: string): Observable<ArticleType> {
    return this.http.get<ArticleType>(environment.api + 'articles/' + url);
  }

  public getArticles(params: ParamsType) {
    let httpParams = new HttpParams();

    if (params.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }

    if (params.categories?.length) {
      params.categories.forEach(category => {
        httpParams = httpParams.append('categories[]', category);
      });
    }

    return this.http.get<{ count: number; pages: number; items: PopularArticleType[]; }>(environment.api + 'articles',
      { params: httpParams }
    );
  }

  public postComment(comment: string, articleId: string): Observable<ResponseType>{
    return this.http.post<ResponseType>(environment.api + 'comments', {text: comment, article: articleId});
  }

  public commentActions(action: string, commentId: string): Observable<ResponseType>{
    return this.http.post<ResponseType>(environment.api + 'comments/' + commentId + '/apply-action', {action: action});
  }

  public getComments(offset: string, articleId: string): Observable<CommentsType> {
    const params = new HttpParams()
      .set('offset', offset)
      .set('article', articleId);
    return this.http.get<CommentsType>(environment.api + 'comments', {params});
  }

  public getCommentsState(articleId: string): Observable<CommentsStateType[] | ResponseType> {
    const params = new HttpParams()
      .set('articleId', articleId);
    return this.http.get<CommentsStateType[] | ResponseType>(environment.api + 'comments/article-comment-actions', {params});
  }


}
