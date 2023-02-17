import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CustomerModel } from 'src/app/interfaces/customer.interface';
import { CustomerService } from '../../../services/customer.service';
import { DesktopComponent } from '../desktop.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {


  profileForm: FormGroup;
  customerData!: CustomerModel;

  documentTypes: string[] = ["ID Card", "Passport ID"];
  hidePass = true;
  hideConfirmPass = true
  loading = false;
  editing = false;
  customerId = localStorage.getItem("customerID") as string;

  constructor(
    private  customerService: CustomerService,
    private deskComp: DesktopComponent,

    private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      fullname: [''],
      email: ['', [Validators.email]],
      documentType: [''],
      document: [''],
      phone: [''],
      avatarUrl: [''],
      password: ['',[Validators.minLength(6)]],

    },
    { validators: passwordsMatchValidator() }
    );
  }

  ngOnInit(): void {

    this.customerService.refreshCustomerData( localStorage.getItem("customerID") as string);

    this.customerService.customerData.subscribe(value => this.customerData = value as CustomerModel);

    this.updateFormInfo();
  }

  updateFormInfo(){

    this.profileForm.patchValue({
      fullname: this.customerData.fullname,
      email: this.customerData.email,
      documentType: this.customerData.documentType,
      document: this.customerData.document,
      phone: this.customerData.phone,
      avatarUrl: this.customerData.avatarUrl,
    })

  }

  setEditing(){
    this.editing = !this.editing;
  }

  updateData(){

    if(this.editing){

      const newCustomerData = this.profileForm.getRawValue();

      this.customerService.updateCustomerData(this.customerId, newCustomerData);

      this.deskComp.showMain();

    }

  }

   /**
   * Sends the new customer info to be updated in backend
   */
    updateCustomerData() {

      const customer: CustomerModel = this.profileForm.getRawValue();

      this.customerService.updateCustomerData(this.customerData.id, customer);

    }

}


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

