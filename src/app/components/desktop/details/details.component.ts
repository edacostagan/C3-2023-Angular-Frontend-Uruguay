import { Component, OnInit } from '@angular/core';
import { AccountModel } from '../../../interfaces/account.interface';

import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  accounts!: AccountModel[] ;

  constructor(

    private customerService: CustomerService,

  ){}


  ngOnInit(): void {

    this.customerService.customerAccounts.subscribe(value => this.accounts = value);

  }

  refreshAccounts(){
    this.customerService.updateCustomerAccounts();
  }

}


