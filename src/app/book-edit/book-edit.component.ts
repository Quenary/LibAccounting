import { BookModel } from './../core/models/book.model';
import { BookService } from './../core/services/book.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CategoryModel } from './../core/models/category.model';
import { AuthorModel } from './../core/models/author.model';
import { AuthorService } from './../core/services/author.service';
import { CategoryService } from './../core/services/category.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BookEditModal, BookEditTypes } from './book-edit.model';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.scss']
})
export class BookEditComponent implements OnInit {

  public authors: AuthorModel[];
  public categories: CategoryModel[];
  public types = BookEditTypes;
  public loading: boolean = false;

  public bookForm: FormGroup;

  public get isbn() { return this.bookForm.controls.isbn; }
  public get name() { return this.bookForm.controls.name; }
  public get description() { return this.bookForm.controls.description; }
  public get category() { return this.bookForm.controls.category; }
  public get author() { return this.bookForm.controls.author; }

  constructor(
    public dialogRef: MatDialogRef<BookEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BookEditModal,
    private categoryService: CategoryService,
    private authorService: AuthorService,
    private formBuilder: FormBuilder,
    private bookService: BookService
  ) { }

  ngOnInit(): void {
    if (!this.data) {
      this.data = {
        editType: this.types.create,
        book: {
          isbn: '',
          name: '',
          description: '',
          categoryId: null,
          authorId: null
        }
      }
    }

    this.bookForm = this.formBuilder.group({
      isbn: [this.data.book.isbn, [Validators.required]],
      name: [this.data.book.name, [Validators.required]],
      description: [this.data.book.description, [Validators.required]],
      category: [this.data.book.categoryId, [Validators.required]],
      author: [this.data.book.authorId, [Validators.required]],
    });

    this.categoryService.get().subscribe(
      (res) => {
        this.categories = res;
        console.log(res);
      },
      (error) => {
        console.log(error);
      }
    )

    this.authorService.get().subscribe(
      (res) => {
        this.authors = res;
        console.log(res)
      },
      (error) => {
        console.log(error);
      }
    )
  }


  onCancelClick() {
    this.dialogRef.close();
  }

  onSaveClick() {
    if (this.bookForm.invalid) {
      console.log('invalid form')
      return;
    }

    this.loading = true;

    let book: BookModel = {
      isbn: this.isbn.value,
      name: this.name.value,
      description: this.description.value,
      categoryId: this.category.value,
      authorId: this.author.value
    }

    this.data.editType === this.types.create ? this.postBook(book) : this.putBook(book);
  }

  private postBook(book: BookModel) {
    this.bookService.post(book).subscribe(
      (res) => {
        console.log(res);
        this.loading = false;
        this.dialogRef.close(true);
      },
      (error) => {
        console.log(error);
        this.loading = false;
      }
    )
  }

  private putBook(book: BookModel) {
    book.id = this.data.book.id;
    this.bookService.put(book).subscribe(
      (res) => {
        console.log(res);
        this.loading = false;
        this.dialogRef.close(true);
      },
      (error) => {
        console.log(error);
        this.loading = false;
      }
    )
  }
}
