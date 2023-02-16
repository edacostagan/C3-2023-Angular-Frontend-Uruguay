import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../../services/customer.service';
import { AccountModel, AccountDepositModel } from '../../../interfaces/account.interface';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss']
})
export class DepositComponent {

  constructor(
    private readonly customerService: CustomerService,
    private readonly accountService: AccountService,
    private fb: FormBuilder) {
    this.depositForm = this.fb.group({
      destinationAccount: ['', Validators.required],
      amountToDeposit: ['', Validators.required]
    })
  }

  depositForm: FormGroup;
  accounts!: AccountModel[];


  ngOnInit(): void {

    this.customerService.customerAccounts.subscribe(value => this.accounts = value);

  }


  createNewDeposit() {

    const deposit: AccountDepositModel = {
      accountId: this.depositForm.value.destinationAccount.id ,
      amount: this.depositForm.value.amountToDeposit as number
    }

    console.log(this.depositForm.value.destinationAccount)
console.log(deposit);

    this.accountService.registerNewDeposit(deposit)
    .subscribe( response => {
      console.log(response)
    })


   }
}
