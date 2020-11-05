import { AuthorService } from './services/author.service';
import { AuthService } from './services/auth.service';
import { ApiService } from './services/api.service';
import { CategoryService } from './services/category.service';
import { BookService } from './services/book.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    ApiService,
    BookService,
    CategoryService,
    AuthorService,
    AuthService
  ]
})
export class CoreModule { }
