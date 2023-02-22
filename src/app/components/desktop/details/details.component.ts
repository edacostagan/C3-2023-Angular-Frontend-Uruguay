import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { AccountModel, AccountMovementModel, AccountMovementTransferModel } from '../../../interfaces/account.interface';
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

  movementsDatasource!: MatTableDataSource<AccountMovementModel>;

  totalBalance: number = 0;
  currentCustomerBankAccount: string = "";

  accountsDisplayedColumns: string[] = ['id', 'accountType', 'balance', 'actions'];
  movementsDisplayedColumns: string[] = ['date', 'originAccount', 'destinationAccount', 'balance', 'concept', 'actions'];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private customerService: CustomerService,
    private accountService: AccountService,

  ) { }


  ngOnInit(): void {

    this.customerService.customerAccounts.subscribe(value => this.accounts = value);
    this.customerService.customerTotalBalance.subscribe(value => this.totalBalance = value);

    const id = localStorage.getItem("customerID") as string;

    this.customerService.refreshCustomerData(id);
    this.customerService.refreshCustomerAccounts(id)

    if (this.accounts.length > 0) this.currentCustomerBankAccount = this.accounts[0].id

    this.refreshCurrentAccountMovements(this.currentCustomerBankAccount);

  }


  ngAfterViewInit() {
    this.movementsDatasource.paginator = this.paginator;
  }


  //Gets the index of the account clicked in the accounts form
  getAccountId(idx: number) {

    this.currentCustomerBankAccount = this.accounts[idx].id;
    this.refreshCurrentAccountMovements(this.currentCustomerBankAccount);
  }

  /**
   * refresh account movements
   */
  refreshCurrentAccountMovements(id: string) {


    //this.accountService.clearAccountMovements();

    this.movements = [];

    this.accountService.getDepositsToCurrentAccount(id);
    this.accountService.getTransferToCurrentAccount(id);

    let deposits: AccountMovementModel[] = [];
    let transfers: AccountMovementTransferModel[] = [];

    deposits = this.accountService.deposits;
    transfers = this.accountService.transfers;

    this.formatAccountMovements(deposits);
    this.addTransfersToMovements(transfers);

    if (deposits.length == 0 && transfers.length == 0) {
      this.movements = [];
    }

    this.movementsDatasource = new MatTableDataSource(this.movements);
  }


  /**
   * Sets the correct display format for account deposits
   */
  formatAccountMovements(deposits: AccountMovementModel[]) {
    deposits.forEach(element => {
      element.destinationAccountId = element.accountId;
      element.accountId = "N/A";
      element.reason = 'Direct Deposit';
    });

    this.movements = deposits;
  }

  /**
   * sets the correct display format to transfer movements
   */
  addTransfersToMovements(transfers: AccountMovementTransferModel[]) {

    transfers.forEach(element => {

      let formatedTransferDisplay: AccountMovementModel = {
        id: element.id,
        accountId: element.outcome,
        destinationAccountId: element.income,
        amount: element.amount,
        reason: element.reason,
        datetime: Number(element.datetime),
      }

      this.movements.push(formatedTransferDisplay)
    });
  }


  /**
   *  converts from datetime number to date format
   */
  convertToDateFormat(datetime: number) {

    return new Date(datetime).toLocaleDateString('es-ES');
  }

}
