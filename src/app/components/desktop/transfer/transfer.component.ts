import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AccountModel } from 'src/app/interfaces/account.interface';
import { AccountService } from 'src/app/services/account.service';
import { CustomerService } from 'src/app/services/customer.service';
import { MessengerService } from 'src/app/services/messenger.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../../shared/confirm-dialog/confirm-dialog.component';
import { DesktopComponent } from '../desktop.component';
import { AccountTransferModel } from '../../../interfaces/account.interface';

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

  originAccount!: string;

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
      amountToTransfer: [0, [Validators.required, Validators.min(1)]],
      comments: ['', Validators.required],
    },
      { validators: accountHasEnoughFounds() }
    )
    //TODO: reactivar validators
  }



  ngOnInit(): void {
    this.customerService.customerAccounts.subscribe(value => this.accounts = value);

    this.customerId = localStorage.getItem("customerID") as string;
  }

  findDestinationAccounts() {
    this.confirmDialog("Find Accounts", "Not implemented yet!", false)
  }


  newTransferConfirmation() {
    this.confirmDialog("Make New Transfer", "Confirm Deposit?", true)
  }

  confirmDialog(title: string, message: string, doingTransfer: boolean) {

    const dialogData = new ConfirmDialogModel(title, message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {

      if (dialogResult) {

        this.makeTransfer();


      } else {

        this.resetForm();

      }
    });
  }


  makeTransfer() {

    let amountToTransfer: number = this.transferForm.value.amountToTransfer;
    let destinationAccount: string = this.transferForm.value.destinationAccount;
    this.originAccount = this.transferForm.value.originAccount.id;
    let comments: string = this.transferForm.value.comments;

    const transfer: AccountTransferModel = {
      outcome: String(this.originAccount),
      income: String(destinationAccount),
      amount: Number(amountToTransfer),
      reason: String(comments),
    }

    this.accountService.registerNewTransfer(transfer)
      .subscribe(response => {

        if (response.status) {
          this.messages.infoMsg("Transference Completed!", "", 4000);

          this.accountService.getDepositsToCurrentAccount(this.originAccount);
          this.accountService.getTransferToCurrentAccount(this.originAccount);
          this.deskComp.showMain();

        } else {
          this.messages.infoMsg("Transfer Failed!", "", 4000);
          this.resetForm()
        }
      })
  }


  resetForm() {
    this.customerService.refreshCustomerAccounts(localStorage.getItem("customerID") as string);
    this.transferForm.reset();

    this.originAccount="";
  }

}

function accountHasEnoughFounds(): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {
    const availableFounds = control.get('originAccount')?.value.balance;

    const amountToTransfer = control.get('amountToTransfer')?.value;

    if (availableFounds < amountToTransfer) {
      return {
        accountHasEnoughFounds: false
      }
    }
    return null;
  }
}
