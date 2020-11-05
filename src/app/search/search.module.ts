import { BookEditModule } from './../book-edit/book-edit.module';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SearchService } from './service/search.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { SearchNodeComponent } from './search-node/search-node.component';
import { MatFormFieldModule } from '@angular/material/form-field';


@NgModule({
  declarations: [SearchComponent, SearchNodeComponent],
  imports: [
    CommonModule,
    SearchRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    BookEditModule
  ],
  providers: [
    SearchService
  ]
})
export class SearchModule { }
