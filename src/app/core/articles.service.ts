import { Injectable } from '@angular/core';
import {PopularArticleType} from "../../types/popular-article.type";
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {ParamsType} from "../../types/params.type";
import {ArticleType} from "../../types/article.type";
import {ResponseType} from "../../types/response.type";

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http: HttpClient) { }

  getAllArticles(): Observable<{count: number, pages: number, items: PopularArticleType[]}> {
    return this.http.get<{count: number, pages: number, items: PopularArticleType[]}>(environment.api + 'articles');
  }

  getPopularArticles(): Observable<PopularArticleType[]> {
    return this.http.get<PopularArticleType[]>(environment.api + 'articles/top');
  }

  getRelatedArticles(url: string): Observable<PopularArticleType[]> {
    return this.http.get<PopularArticleType[]>(environment.api + 'articles/related/' + url);
  }

  getArticle(url: string): Observable<ArticleType> {
    return this.http.get<ArticleType>(environment.api + 'articles/' + url);
  }

  getArticles(params: ParamsType) {
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

  postComment(comment: string, articleId: string): Observable<ResponseType>{
    return this.http.post<ResponseType>(environment.api + 'comments', {text: comment, article: articleId});
  }

  commentActions(action: string, commentId: string): Observable<ResponseType>{
    return this.http.post<ResponseType>(environment.api + 'comments/' + commentId + '/apply-action', {action: action});
  }


}
