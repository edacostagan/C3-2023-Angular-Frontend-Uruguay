import { Component, OnInit } from '@angular/core';

import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss']
})


export class DesktopComponent implements OnInit {

  showMainPage: boolean = true;
  showProfilePage: boolean = false;
  showDepositPage: boolean = false;
  showTransferPage: boolean = false;

  customerId!: string;
  customerName!: string;
  customerAvatarUrl!: string;

  constructor(
    private customerService: CustomerService,

  ) { }

  ngOnInit(): void {

    this.customerService.updateCustomerName(localStorage.getItem('customerFullname') as string);

    this.customerService.customerId.subscribe(value => this.customerId = value);
    this.customerService.customerName.subscribe(value => this.customerName = value);
    this.customerService.customerAvatarURL.subscribe(value => this.customerAvatarUrl = value);
    this.customerId = localStorage.getItem("customerID") as string;

    this.showMain();
  }


  /**
   * shows main desktop page
   */
  showMain(){

    this.showMainPage = true;
    this.showProfilePage = false;
    this.showDepositPage = false;
    this.showTransferPage = false;
  }

  /**
   * shows customer profile page
   */
  showProfile(){
    this.showMainPage = false;
    this.showProfilePage = true;
    this.showDepositPage = false;
    this.showTransferPage = false;
  }

  /**
   * shows deposits page
   */
  makeDeposit(){

    this.showMainPage = false;
    this.showProfilePage = false;
    this.showDepositPage = true;
    this.showTransferPage = false;
  }

  /**
   * shows trasnfer page
   */
  makeTransfer(){
    this.showMainPage = false;
    this.showProfilePage = false;
    this.showDepositPage = false;
    this.showTransferPage = true;
  }

}




