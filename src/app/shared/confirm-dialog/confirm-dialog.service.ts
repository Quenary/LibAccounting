import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  constructor(
    private matDialog: MatDialog
  ) { }

  openConfirmDialog(message: string) {
    return this.matDialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: message
    });
  }
}
