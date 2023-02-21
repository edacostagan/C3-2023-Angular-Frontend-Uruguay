import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../../services/customer.service';
import { AccountModel, AccountDepositModel, CreateBankAccountModel } from '../../../interfaces/account.interface';
import { AccountService } from '../../../services/account.service';
import { MessengerService } from 'src/app/services/messenger.service';
import { DesktopComponent } from '../desktop.component';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../../shared/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss']
})
export class DepositComponent {


  depositForm: FormGroup;
  newAccountForm: FormGroup

  customerId!: string;
  accountTypeNames: string[] = ["Saving", "Checks"];

  accounts!: AccountModel[];
  newAccount: boolean = false;

  constructor(
    private customerService: CustomerService,
    private accountService: AccountService,
    private messages: MessengerService,
    private deskComp: DesktopComponent,
    public dialog: MatDialog,

    private fb: FormBuilder) {
    this.depositForm = this.fb.group({
      destinationAccount: ['', Validators.required],
      amountToDeposit: [0, [Validators.required, Validators.min(1)]]
    })

    this.newAccountForm = this.fb.group({
      accountTypeName: ['Saving', Validators.required]
    })
  }

  ngOnInit(): void {
    this.customerService.customerAccounts.subscribe(value => this.accounts = value);

    this.customerId = localStorage.getItem("customerID") as string;
  }

  /**
   * sets account creation status
   */
  setCreateNewAccount() {
    this.newAccount = !this.newAccount;
  }


  /**
   * ask for confirmation on account creation
   */
  createAccountConfirmation() {

    if (this.newAccount) {

      this.confirmDialog("Create New Account", "Are you sure?", true)
    }
  }

  /**
   * Ask for confirmation and redirect accordingly
   * @param title
   * @param message
   */
  confirmDialog(title: string, message: string, creatingAccount: boolean) {

    const dialogData = new ConfirmDialogModel(title, message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {

      if (dialogResult) {

        if (creatingAccount) this.createAccountProcess();

        else this.createNewDeposit();

      } else {

        if (creatingAccount) this.setCreateNewAccount();
        else this.resetForm();
      }
    });
  }

  /**
   * Collect the data for the creation of new account
   * and send it to service
   */
  createAccountProcess() {

    let newAccount: CreateBankAccountModel = this.newAccountForm.getRawValue();

    newAccount.customerId = String(this.customerId);
    newAccount.accountTypeName = String(this.newAccountForm.value.accountTypeName);

    this.accountService.createNewBankAccount(newAccount)

    this.messages.infoMsg("New Account Created!", '', 4000);

    this.customerService.getCustomerAccounts(this.customerId)

    this.setCreateNewAccount();

  }


  /**
   * Ask confirmation on new deposit
   */
  newDepositConfirmation() {

    this.confirmDialog("Create New Deposit", "Confirm Deposit?", false)
  }

  /**
   * Collect the info to make a new deposit registration
   */
  createNewDeposit() {

    let amountToDeposit: number = this.depositForm.value.amountToDeposit;
    let destination: string = this.depositForm.value.destinationAccount.id;

    const deposit: AccountDepositModel = {
      accountId: destination,
      amount: Number(amountToDeposit)
    }

    this.accountService.registerNewDeposit(deposit)
      .subscribe(response => {

        if (response.status) {
          this.messages.infoMsg("Deposit Completed!", "", 4000);

          this.accountService.getDepositsToCurrentAccount(destination);

          this.deskComp.showMain();

        } else {
          this.messages.infoMsg("Deposit Failed!", "", 4000);
        }
        this.resetForm()
      })
  }

  /**
   * clears the deposit form
   */
  resetForm() {
    this.customerService.refreshCustomerAccounts(localStorage.getItem("customerID") as string);
    this.depositForm.reset();
  }
}
