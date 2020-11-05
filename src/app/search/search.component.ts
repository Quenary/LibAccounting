import { SearchService } from './service/search.service';
import { UserRoles } from './../core/models/user-roles.model';
import { AuthService } from './../core/services/auth.service';
import { UserModel } from './../core/models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchNodeModel, SearchNodeTypes } from './search-node/search-node.model';
import { CategoryModel } from './../core/models/category.model';
import { BookModel } from './../core/models/book.model';
import { CategoryService } from './../core/services/category.service';
import { BookService } from './../core/services/book.service';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, Pipe, ViewChild } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { debounceTime, filter, map, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { BookEditComponent } from '../book-edit/book-edit.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchInput', { static: false }) searchBar: ElementRef;

  public loading: boolean = true;

  public roles = UserRoles;
  public user: UserModel;

  private search$: Subscription;
  private user$: Subscription;

  private constSearchTree: SearchNodeModel;
  public resultSearchTree: SearchNodeModel;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private searchService: SearchService,
    private dialog: MatDialog,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadData()
    .then(() => {
      this.applySearchInitParam();
    })
    .finally(() => {
      this.loading = false;
    })
    this.user$ = this.authService.watchUser().subscribe(
      (res) => {
        this.user = res;
      },
      (error) => {
        console.log(error)
      }
    );
  }

  ngAfterViewInit(): void {
    this.search$ = fromEvent(this.searchBar.nativeElement, 'input').pipe(
      debounceTime(1000),
      map((event: any) => String(event.target.value)),
      tap((value: string) => {
        this.loading = true;
      })
    ).subscribe({
      next: (value: string) => {
        this.resultSearchTree.subItems = this.searchService.getFilteredNodes(value, this.constSearchTree.subItems);
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.search$.unsubscribe();
    this.user$.unsubscribe();
  }

  private applySearchInitParam() {
    let value = this.activatedRoute.snapshot.paramMap.get('value');
    if (value) {
      this.searchBar.nativeElement.value = value;
      this.resultSearchTree.subItems = this.searchService.getFilteredNodes(value, this.constSearchTree.subItems);
    }
  }

  private async loadData() {
    return this.searchService.createSearchNode()
      .then(node => {
        this.constSearchTree = node;
        this.resultSearchTree = {...node};
      })
      .catch(error => {
        console.log(error);
      });
  }

  public addBookDialog() {
    let width = (window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth).toString();
    const dialogRef = this.dialog.open(BookEditComponent, {
      width: `${width}px`
    });
    dialogRef.afterClosed().subscribe(res => {
      console.log(res);
      if (res) {
        this.loadData();
      }
    });
  }
}