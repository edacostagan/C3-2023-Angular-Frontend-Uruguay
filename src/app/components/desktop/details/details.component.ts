import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

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

  //movementsDatasource: MatTableDataSource<AccountMovementModel> = new MatTableDataSource(this.movements);

  totalBalance: number = 0;
  currentCustomerBankAccount: string = "";

  accountsDisplayedColumns: string[] = ['id', 'accountType', 'balance', 'actions'];
  movementsDisplayedColumns: string[] = ['date', 'originAccount', 'destinationAccount', 'balance', 'concept'];

  //@ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private customerService: CustomerService,
    private accountService: AccountService,
  ) { }


  ngOnInit(): void {

    this.customerService.customerAccounts.subscribe(value => this.accounts = value);
    this.customerService.customerTotalBalance.subscribe(value => this.totalBalance = value);

    const id= localStorage.getItem("customerID") as string;

    this.customerService.refreshCustomerData(id);
    this.customerService.refreshCustomerAccounts(id)

    if(this.accounts.length != 0)    this.currentCustomerBankAccount = this.accounts[0].id

    //this.customerService.refreshCustomerAccounts(this.currentCustomerBankAccount);

    this.refreshCurrentAccountMovements();
  }

  //ngAfterViewInit() {
 //   this.movementsDatasource.paginator = this.paginator;
  //}

  refreshCurrentAccountMovements() : any {

     return this.accountService.getDepositsToCurrentAccount(this.currentCustomerBankAccount);



  }

}
