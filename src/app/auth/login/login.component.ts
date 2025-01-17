import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { findInvalidControls } from 'src/app/helper';
import { first } from 'rxjs/operators';

import { AuthenticationService, AlertService } from '../../services';
import { GlobalConstants } from '../../common/index';
import { HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  returnUrl: string = '';
  loginError: string = '';
  loading = false;
  hide = true;
  userLanguages: any = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) {

    // redirect to home if already logged in
    // if (!GlobalConstants.commonFunction.isEmptyObject(this.authenticationService.currentUserValue)) {
    //   this.router.navigate([GlobalConstants.ROUTE_URLS.dashboard]);
    // }
  }

  ngOnInit() {

    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(30), Validators.email]],
      password: ['', [Validators.required, Validators.maxLength(30)]],
      language: ['', [Validators.required, Validators.maxLength(30)]],
    });

    this.userLanguages = GlobalConstants.commonFunction.getUserLanguages();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || GlobalConstants.ROUTE_URLS.dashboard;

    this.setDefaultValue();

  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  setDefaultValue() {

    this.loginForm.patchValue({
      language: this.userLanguages[0].key
    })
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (!findInvalidControls(this.loginForm)) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f['username'].value, this.f['password'].value, this.f['language'].value)
      .pipe(first())
      .subscribe(
        (data:HttpResponse<any>) => {

          // login successful if there's a jwt token in the response
          if (data) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            // localStorage.setItem('currentUser', JSON.stringify(user));
            // this.currentUserSubject.next(user);
            // console.log(data);
             console.log(data.headers.get('kamal'));
             console.log(data.headers.get('Set-Cookie'));
            // console.log(data.headers.get('X-Token'));

        
            

             this.router.navigate([this.returnUrl]);


          }

         
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }
}

