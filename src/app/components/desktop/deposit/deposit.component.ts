import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../../services/customer.service';
import { AccountModel, AccountDepositModel } from '../../../interfaces/account.interface';
import { AccountService } from '../../../services/account.service';
import { MessengerService } from 'src/app/services/messenger.service';
import { DesktopComponent } from '../desktop.component';
import { DetailsComponent } from '../details/details.component';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss']
})
export class DepositComponent {


  depositForm: FormGroup;
  accounts!: AccountModel[];

  constructor(
    private customerService: CustomerService,
    private accountService: AccountService,
    private messages: MessengerService,
    private deskComp: DesktopComponent,

    private fb: FormBuilder) {
    this.depositForm = this.fb.group({
      destinationAccount: ['', Validators.required],
      amountToDeposit: [0, [Validators.required, Validators.min(1)]]
    })
  }


  ngOnInit(): void {

    this.customerService.customerAccounts.subscribe(value => this.accounts = value);

  }

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

  resetForm() {
    this.customerService.refreshCustomerAccounts(localStorage.getItem("customerID") as string);
    this.depositForm.reset();
  }


}
