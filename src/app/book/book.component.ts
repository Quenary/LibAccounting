import { ConfirmDialogService } from './../shared/confirm-dialog/confirm-dialog.service';
import { ConfirmDialogComponent } from './../shared/confirm-dialog/confirm-dialog.component';
import { BookEditComponent } from '../book-edit/book-edit.component';
import { UserRoles } from './../core/models/user-roles.model';
import { UserModel } from './../core/models/user.model';
import { AuthorService } from './../core/services/author.service';
import { AuthService } from './../core/services/auth.service';
import { CategoryService } from './../core/services/category.service';
import { CategoryModel } from './../core/models/category.model';
import { AuthorModel } from './../core/models/author.model';
import { BookModel } from './../core/models/book.model';
import { BookService } from './../core/services/book.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { find, map, tap } from 'rxjs/operators';
import { BookEditModal, BookEditTypes } from '../book-edit/book-edit.model';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {

  public user: UserModel;
  public user$: Subscription;
  public roles = UserRoles;

  public book: BookModel;
  public bookCategories: CategoryModel[] = [];
  public author: AuthorModel;
  public errorMessage: string = '';

  constructor(
    private bookService: BookService,
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute,
    private authorService: AuthorService,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog,
    private confirmDialogService: ConfirmDialogService
  ) { }

  ngOnInit(): void {
    const isbn = this.activatedRoute.snapshot.paramMap.get('isbn');

    this.bookService.getByIsbn(isbn).subscribe(
      (res) => {
        this.book = res;

        this.getBookCategory();
        this.getBookAuthor();
      },
      (error: HttpErrorResponse) => {
        let message = 'Произошла ошибка. ';
        if (error.status === 404) {
          message += 'Книга не найдена.';
        }
        this.errorMessage = message;
      });

    this.user$ = this.authService.watchUser().subscribe(res => {
      this.user = res;
    });
  }

  public navigateTo(url: string) {
    console.log(url)
    this.router.navigate([url]);
  }

  public editBook() {
    let data: BookEditModal = {
      editType: BookEditTypes.edit,
      book: {...this.book}
    }

    let width = (window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth).toString();
    const dialogRef = this.dialog.open(BookEditComponent, {
      width: `${width}px`,
      data
    });
    dialogRef.afterClosed().subscribe(res => {
      console.log(res);
    });
  }

  public deleteBookDialog() {
    this.confirmDialogService.openConfirmDialog('Вы уверены, что хотите удалить эту книгу?')
    .afterClosed().subscribe(res => {
      if (res == true) {
        this.deleteBook();
      }
    })
  }

  private deleteBook() {
    this.bookService.delete(this.book.isbn).subscribe(
      (res) => {
        this.navigateTo('/search');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private getBookCategory() {
    this.categoryService.get()
      .pipe(
        map(cats => {
          let id = this.book.categoryId;
          let categories: CategoryModel[] = [];
          while (id) {
            let cat = cats.find(c => c.id === id);
            categories.unshift(cat);
            id = cat.parentCategoryId;
          }
          return categories;
        })
      )
      .subscribe(
        (res) => {
          this.bookCategories = res;
          console.log(res);
        },
        (error) => {
          console.log(error);
        });
  }

  private getBookAuthor() {
    this.authorService.get()
      .pipe(
        map(res => res.find(a => a.id === this.book.authorId))
      )
      .subscribe(
        (res) => {
          this.author = res;
        },
        (error) => {
          console.log(error);
        }
      )
  }
}
