import { Component, OnInit } from '@angular/core';
import { AccountModel, AccountMovementModel } from '../../../interfaces/account.interface';

import { CustomerService } from '../../../services/customer.service';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  accounts!: AccountModel[];
  movements!: AccountMovementModel[];

  totalBalance: number = 0 ;
  currentCustomerBankAccount: string = "";

  accountsDisplayedColumns: string[] = ['id', 'accountType', 'balance', 'actions'];
  movementsDisplayedColumns: string[] = ['date', 'originAccount', 'destinationAccount', 'balance', 'concept'];


  constructor(
    private customerService: CustomerService,
    private accountService: AccountService,
  ){}


  ngOnInit(): void {

    this.customerService.customerAccounts.subscribe(value => this.accounts = value);
    this.customerService.customerTotalBalance.subscribe(value => this.totalBalance = value);

    this.currentCustomerBankAccount = this.accounts[0].id

    this.refreshCurrentAccountMovements();
  }

  refreshCurrentAccountMovements() {

    const tempMovements: any = this.accountService.getDepositsToCurrentAccount(this.currentCustomerBankAccount);

    if( tempMovements != null){
      this.movements = tempMovements;
    }

  }

}
