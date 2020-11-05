import { UserModel } from './../../core/models/user.model';
import { AuthService } from './../../core/services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  public user: UserModel;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.watchUser().subscribe(res => {
      this.user = res;
    });
    this.authService.getAccount().subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (error) => {
        console.log(error)
      }
    });
  }

  public logoutClick() {
    this.authService.logout();
  }
}
