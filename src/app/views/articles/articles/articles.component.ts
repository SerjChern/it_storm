import { Component, OnInit } from '@angular/core';
import {ArticlesService} from "../../../core/articles.service";
import {ParamsType} from "../../../../types/params.type";
import {PopularArticleType} from "../../../../types/popular-article.type";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../core/auth.service";
import {CategoriesType} from "../../../../types/categories.type";

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {

  protected parameters: ParamsType = {categories: []};
  protected count: number = 0;
  protected pages: number[] = [];
  protected articles: PopularArticleType[] = [];
  protected sortingOpen : boolean = false;
  protected categories: CategoriesType[] = [];
  protected appliedCategories: CategoriesType[] = [];
  constructor(private articlesService: ArticlesService,
              private authService: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              ) { }

  public ngOnInit(): void {
    this.authService.getCategories()
      .subscribe((data: CategoriesType[])=>{
        if (data){
          this.categories = data;
        }

        this.activatedRoute.queryParams.subscribe(params => {
          this.parameters.page = +params['page'] || 1;

          this.parameters.categories = params['categories']
            ? Array.isArray(params['categories'])
              ? params['categories']
              : [params['categories']]
            : [];

          this.appliedCategories = this.categories.filter(category =>
            this.parameters.categories.includes(category.url)
          );


          this.articlesService.getArticles(this.parameters).subscribe(data => {
            this.pages = [];
            for (let i=1; i <= data.pages; i++) {
              this.pages.push(i);
            }
            this.count = data.count;
            this.articles = data.items;
          });
        });
      });
  }

  protected sort(value: string) {
    const categories = this.parameters.categories ?? [];

    const exists = categories.includes(value);

    const newCategories = exists
      ? categories.filter(category => category !== value)
      : [...categories, value];

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        page: 1,
        categories: newCategories.length ? newCategories : null,
      },
      queryParamsHandling: 'merge'
    });
  }

  protected removeFilter(categoryUrl: string) {
    const newCategories = this.parameters.categories
      ?.filter(c => c !== categoryUrl);

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        page: 1,
        categories: newCategories?.length ? newCategories : null
      },
      queryParamsHandling: 'merge'
    });
  }

  protected toggleSorting() {
    this.sortingOpen = !this.sortingOpen;
  }

  protected openPrevPage(){
    if (this.parameters.page && this.parameters.page > 1){
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: { page: this.parameters.page - 1 },
        queryParamsHandling: 'merge'
      });
    }
  }

  protected openNextPage(){
    if (this.parameters.page && this.parameters.page < this.pages.length) {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: { page: this.parameters.page + 1 },
        queryParamsHandling: 'merge'
      });
    }
  }

  protected openPage(page: number){
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: { page: page },
        queryParamsHandling: 'merge'
      });
  }
}
