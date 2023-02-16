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


  depositForm: FormGroup;
  accounts!: AccountModel[];

  constructor(
    private readonly customerService: CustomerService,
    private readonly accountService: AccountService,
    private fb: FormBuilder) {
    this.depositForm = this.fb.group({
      destinationAccount: ['', Validators.required],
      amountToDeposit: ['', Validators.required]
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
      amount: amountToDeposit
    }

    console.log(this.depositForm.value.destinationAccount)

console.log(deposit);

    this.accountService.registerNewDeposit(deposit)
    .subscribe( response => {
      console.log(response)
    })


   }
}
