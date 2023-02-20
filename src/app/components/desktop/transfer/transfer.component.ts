import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AccountModel } from 'src/app/interfaces/account.interface';
import { AccountService } from 'src/app/services/account.service';
import { CustomerService } from 'src/app/services/customer.service';
import { MessengerService } from 'src/app/services/messenger.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../../shared/confirm-dialog/confirm-dialog.component';
import { DesktopComponent } from '../desktop.component';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {


  transferForm: FormGroup;


  customerId!: string;


  accounts!: AccountModel[];
  newAccount: boolean = false;

  constructor(
    private customerService: CustomerService,
    private accountService: AccountService,
    private messages: MessengerService,
    private deskComp: DesktopComponent,
    public dialog: MatDialog,

    private fb: FormBuilder) {
    this.transferForm = this.fb.group({
      originAccount: ['', Validators.required],
      destinationAccount: ['', Validators.required],
      amountToDeposit: [0, [Validators.required, Validators.min(1)]]
    })


  }


  ngOnInit(): void {
    this.customerService.customerAccounts.subscribe(value => this.accounts = value);

    this.customerId = localStorage.getItem("customerID") as string;
  }

  findDestinationAccounts(){

  }


  newTransferConfirmation(){
    this.confirmDialog("Make New Transfer", "Confirm Deposit?", false)
  }

  confirmDialog(title: string, message: string, creatingAccount: boolean) {

    const dialogData = new ConfirmDialogModel(title, message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {

      if (dialogResult) {



      } else {


      }
    });
  }


  resetForm() {
    this.customerService.refreshCustomerAccounts(localStorage.getItem("customerID") as string);
    this.transferForm.reset();
  }

}
