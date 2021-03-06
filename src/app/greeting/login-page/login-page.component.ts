import { Component, OnInit, ViewChild } from '@angular/core';
import {FormGroup} from "@angular/forms";
import {AuthService} from "../../services/api-services/auth.service";
import {Router} from "@angular/router";
import {flyInOut} from "../../animations";
import {ApiErrorService} from "../../services/api-services/api-error.service";
import {WsTitleService} from "../../services/ui-services/ws-title.service";
import {ErrorApiResponse} from "../../services/api-services/models/responses/error-api-response.interface";
import {AuthResponse} from "../../services/api-services/models/responses/auth-response.interface";

@Component({
  selector: 'ws-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  host: {
    '[@flyInOut]' : 'true'
  },
  animations: [
    flyInOut
  ],
  styles: [':host { width: 100%; }']
})
export class LoginPageComponent implements OnInit {

  private loginForm: FormGroup;
  private loginSubmitted: boolean;
  private success: boolean;
  private response: string;


  constructor(
    private authService: AuthService,
    private router: Router,
    private errorService: ApiErrorService,
    private titleService: WsTitleService,
  ) { }

  ngOnInit() {
    this.loginSubmitted = false;
    this.success = true;
    this.response = '';
    this.titleService.currentTitle = 'Log In';
  }

  private onEnterPressed(): void {
    if (this.loginForm.valid) {
      this.submitLoginForm();
    }
  }

  private onLoginClicked(): void {
    this.submitLoginForm();
  }

  private submitLoginForm(): void {
    this.authService.authenticateUser(
        this.loginForm.value.email,
        this.loginForm.value.password
      ).subscribe(
        (data) => this.onLoginSuccess(data),
        (err) => this.onLoginFailure(err)
      );
  }

  private onLoginFormChanged(loginForm: FormGroup): void {
    this.loginForm = loginForm;
  }

  private onLoginFailure(response: ErrorApiResponse): void {
    debugger;
    this.success = false;
    this.loginSubmitted = true;
    this.response = response.detail;
    this.loginForm.controls['password'].reset();
  }

  private onLoginSuccess(authResponse: AuthResponse): void {
    this.loginSubmitted = true;
    this.success = true;
    this.response = 'Successfully logged in!';
    if (this.authService.redirectUrl) {
      this.router.navigate([this.authService.redirectUrl]);
    } else {
      this.router.navigate(['/organizations']);
    }
  }

}
