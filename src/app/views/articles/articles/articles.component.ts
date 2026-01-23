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

  parameters: ParamsType = {categories: []};
  count: number = 0;
  pages: number[] = [];
  articles: PopularArticleType[] = [];
  sortingOpen : boolean = false;
  categories: CategoriesType[] = [];
  appliedCategories: CategoriesType[] = [];
  constructor(private articlesService: ArticlesService,
              private authService: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              ) { }

  ngOnInit(): void {
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

  sort(value: string) {
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

  removeFilter(categoryUrl: string) {
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

  toggleSorting() {
    this.sortingOpen = !this.sortingOpen;
  }

  openPrevPage(){
    if (this.parameters.page && this.parameters.page > 1){
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: { page: this.parameters.page - 1 },
        queryParamsHandling: 'merge'
      });
    }
  }

  openNextPage(){
    if (this.parameters.page && this.parameters.page < this.pages.length) {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: { page: this.parameters.page + 1 },
        queryParamsHandling: 'merge'
      });
    }
  }

  openPage(page: number){
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: { page: page },
        queryParamsHandling: 'merge'
      });
  }
}
