import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CustomerModel } from 'src/app/interfaces/customer.interface';
import { CustomerService } from '../../../services/customer.service';
import { DesktopComponent } from '../desktop.component';
import { MessengerService } from '../../../services/messenger.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../../shared/confirm-dialog/confirm-dialog.component';

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

  confirmationDialogResult!: boolean;


  constructor(
    private customerService: CustomerService,
    private deskComp: DesktopComponent,
    public messages: MessengerService,
    public dialog: MatDialog,

    private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      fullname: [''],
      email: ['', [Validators.email]],
      documentType: [''],
      document: [''],
      phone: [''],
      avatarUrl: [''],
      password: ['', [Validators.minLength(6)]],

    },
      { validators: passwordsMatchValidator() }
    );
  }

  ngOnInit(): void {

    this.customerService.refreshCustomerData(localStorage.getItem("customerID") as string);

    this.customerService.customerData.subscribe(value => this.customerData = value as CustomerModel);

    this.updateFormInfo();
  }


  /**
   * Sets the profileForm with the initial Customer info
   */
  updateFormInfo() {

    this.profileForm.patchValue({
      fullname: this.customerData.fullname,
      email: this.customerData.email,
      documentType: this.customerData.documentType,
      document: this.customerData.document,
      phone: this.customerData.phone,
      avatarUrl: this.customerData.avatarUrl,
    })

  }


/**
 * Sets the editing status
 */
  setEditing() {
    this.editing = !this.editing;
  }

  /**
   * Checks if we are editing the customer data
   */
  updateData() {

    if (this.editing) {

      this.confirmDialog("Update Customer Information", "Are you sure of apply this changes?")

    }

  }


  /**
   * Ask for confirmation ( soon to be moved to message services )
   * @param title
   * @param message
   */
  confirmDialog(title: string, message: string) {

    const dialogData = new ConfirmDialogModel(title, message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {

      if (dialogResult) {
        const newCustomerData = this.profileForm.getRawValue();

        this.updateCustomerData();

      } else {

        this.setEditing();
      }
    });
  }

  /**
  * Sends the new customer info to be updated in backend
  */
  updateCustomerData() {

    const customer: CustomerModel = this.profileForm.getRawValue();

    customer.password = this.customerData.password;

    this.customerService.updateCustomerData(this.customerData.id, customer)

    this.messages.infoMsg("Customer Updated succesfully!", '', 4000);

    this.deskComp.showMain();


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

