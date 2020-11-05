import { FormBuilder, FormGroup } from '@angular/forms';
import { LoginModel } from './../core/models/login.model';
import { AuthService } from './../core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public errorMessage: string = '';
  public loading: boolean = false;
  public hidePass: boolean = true;
  public loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })

  public get email() { return this.loginForm.controls.email; }
  public get password() { return this.loginForm.controls.password; };

  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Пожалуйста, введите e-mail.';
    }
    return 'Некорректный e-mail';
  }
  getPasswordErrorMessage() {
    if (this.password.hasError('required')) {
      return 'Пожалуйста, введите пароль';
    }
    return 'Некорректный пароль';
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      console.log('invalid form')
      return;
    }

    this.loading = true;
    let login: LoginModel = {
      email: this.email.value,
      password: this.password.value
    }

    this.authService.login(login)
      .subscribe(
        data => {
          this.router.navigateByUrl('/search')
        },
        error => {
          if (error.message) {
            this.errorMessage = error.message;
          }
          this.loading = false;
        });
  }
}
