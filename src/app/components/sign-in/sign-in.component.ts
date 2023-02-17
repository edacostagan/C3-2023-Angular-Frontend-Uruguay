import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import jwt_decode from 'jwt-decode';

// Services
import { MessengerService } from '../../services/messenger.service';
import { CustomerService } from '../../services/customer.service';

// Interfaces
import { CustomerSignInModel, CustomerModel } from '../../interfaces/customer.interface';
import { TokenResponseModel as TokenResponseModel } from '../../interfaces/responses.interface';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {

  signinForm: FormGroup;
  loading = false;
  userIsLogged = false;
  hide = true;

  constructor(
    private fb: FormBuilder,
    private messages: MessengerService,
    private router: Router,
    private customerService: CustomerService,
    private authService: AuthService,
  ) {

    this.signinForm = this.fb.group({
      username: ["", [Validators.email, Validators.required]],
      password: ["", [Validators.minLength(6), Validators.required]]
    });
  }

  /**
   * User login from signin form
   */
  login() {
    const formUsername = this.signinForm.value.username;
    const formPassword = this.signinForm.value.password;

    let userSignin: CustomerSignInModel = {
      username: formUsername,
      password: formPassword
    }

    this.loading = true;

    setTimeout(() => {

      this.validateCredentials(userSignin);

    }, 1500);
  }

  /**
   * Gets the User information from Google API and checks that the email
   * has a registered account in the database
   * If so, stores the relevant data in localStorage and redirects
   * to Customer area
   */
  loginWithGoogle() {
    this.authService.loginWithFirebase()
      .then(result => {
        const user = result.user;

        if (user.email != null) {

          this.customerService.findCustomerByEmail(user.email)
            .subscribe({
              next: (signInResponse) => {

                const responseValue: TokenResponseModel = signInResponse as unknown as TokenResponseModel;

                if (responseValue.status) {

                  const token = responseValue.token;

                  let decoded: any = jwt_decode(token);
                  const data: CustomerModel = decoded.data;

                  localStorage.setItem('token', token);
                  localStorage.setItem('customerID', data.id);
                  localStorage.setItem('customer', JSON.stringify(data));
                  if (user.displayName != null) localStorage.setItem('customerFullname', user.displayName);
                  if (user.photoURL != null) localStorage.setItem('customerImage', user.photoURL);

                  this.transitionToDesktop(true);
                }
              },
              error: (e) => {
                this.transitionToDesktop(false);
              }
            })
        }
      }).catch(error => { console.log(error) })
  }

  /**
   * Checks the response from customerService and verifies
   * that the credentials are valid
   * sets in localstorage the data to be used later
   * Redirect the user to desktop or back to login
   */
  validateCredentials(userSignin: CustomerSignInModel) {

    this.customerService.customerSignin(userSignin)
      .subscribe({
        next: (signInResponse) => {

          const responseValue: TokenResponseModel = signInResponse as unknown as TokenResponseModel;

          if (responseValue.status) {

            const token = responseValue.token;

            let decoded: any = jwt_decode(token);
            const data: CustomerModel = decoded.data;

            localStorage.setItem('token', token);
            localStorage.setItem('customer', JSON.stringify(data));
            localStorage.setItem('customerID', data.id);
            localStorage.setItem('customerFullname', data.fullname);
            if (data.avatarUrl) localStorage.setItem('customerImage', data.avatarUrl);


            this.customerService.refreshCustomerAccounts(data.id);

            this.transitionToDesktop(true);
          }
        },
        error: (e) => {
          this.transitionToDesktop(false);
        }
      })
  }

  /**
   * Transition from login to Desktop ( after verify credentials )
   * or back to login form if wrong credentials are given
   */
  transitionToDesktop(result: boolean) {

    if (result) { // login succesfull

      this.authService.setUserLogStatus(true);
      this.authService.setPublicZoneStatus(false);
      this.authService.setUserAccessPermits(true);
      this.loading = false;
      this.router.navigate(["desktop"]);

    } else {    // invalid credentials. Error

      this.loading = false;
      this.messages.infoMsg("Username/Email or Password not valid! Try again", "", 2000);
      this.signinForm.reset();
    }
  }
}


