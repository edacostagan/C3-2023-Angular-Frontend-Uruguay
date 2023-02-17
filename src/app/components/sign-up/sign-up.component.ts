import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

//Interfaces
import { CustomerSignUpModel, CustomerModel } from '../../interfaces/customer.interface';
import { TokenResponseModel } from '../../interfaces/responses.interface';

//Services
import { CustomerService } from '../../services/customer.service';
import { MessengerService } from '../../services/messenger.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {

  signupForm: FormGroup;
  documentTypes: string[] = ["ID Card", "Passport ID"];
  accountTypes: string[] = ["Saving", "Checks"];

  hidePass = true;
  hideConfirmPass = true
  loading = false;

  constructor(private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private messages: MessengerService,
    private authService: AuthService,
  ) {
    this.signupForm = this.fb.group({
      documentType: ["ID Card", Validators.required],
      accountTypeName: ["Saving", Validators.required],
      document: ["", Validators.required],
      fullname: ["", Validators.required],
      email: ["", [Validators.email, Validators.required]],
      phone: [""],
      password: ["", [Validators.minLength(6), Validators.required]],
      confirmPassword: ["", [Validators.minLength(6), Validators.required]]
    },
      { validators: passwordsMatchValidator() }
    );
  }

  /**
   * creates a new instance of Customer
   * ready to be sent to back for registration
   */
  createNewCustomer() {
    const customer: CustomerSignUpModel = this.signupForm.getRawValue();

    this.validateRegistration(customer);

  }

  /**
   * Collects info from google account and
   * sets it in the registration form
   */
  registerWithGoogle() {

    //this gets Google account info and sets it on the form ( user needs to complete all data to register )
    this.authService.loginWithFirebase()
      .then(result => {

        const user = result.user;

        this.signupForm.controls['email'].setValue(result.user.email);
        this.signupForm.controls['fullname'].setValue(result.user.displayName);
        this.signupForm.controls['phone'].setValue(result.user.phoneNumber);

      }).catch (error => { })
    }

    /**
     * Validate the info given to make a new registration
     */
  validateRegistration(customer: CustomerSignUpModel) {

    this.customerService.addNewCustomer(customer)
      .subscribe({
        next: (signupResponse) => {
          const responseValue: TokenResponseModel = signupResponse as unknown as TokenResponseModel;

          if (responseValue.status) {

            this.messages.infoMsg("New Customer created successfully!", "", 2000);

            const token = responseValue.token;
            const decoded: any = jwt_decode(token);
            const data: CustomerModel = decoded.data;

            localStorage.setItem('token', token);
            localStorage.setItem('customer', JSON.stringify(data));

            localStorage.setItem('customerID', data.id);
            localStorage.setItem('customerFullname', data.fullname);
            if(data.avatarUrl) localStorage.setItem('customerImage', data.avatarUrl);

            this.customerService.refreshCustomerAccounts(data.id);

            this.transitionToDesktop(true);
          }
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

    }
  }
}

/**
 * Verify password
 */
function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password != confirmPassword) {
      return {
        passwordsDontMatch: true
      }
    }
    return null;
  }
}
