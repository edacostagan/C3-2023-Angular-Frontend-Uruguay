import { Component, OnInit } from '@angular/core';
import { DesktopService } from '../../services/desktop.service';
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
    private deskService: DesktopService,
  ) { }

  ngOnInit(): void {

    this.customerService.refreshCustomerData();

    this.customerService.updateCustomerName(localStorage.getItem('customerFullname') as string);

    this.customerService.customerId.subscribe(value => this.customerId = value);
    this.customerService.customerName.subscribe(value => this.customerName = value);
    this.customerService.customerAvatarURL.subscribe(value => this.customerAvatarUrl = value);
    this.customerService.refreshCustomerAccounts();

    //this.deskService.updateSessionToken();

    this.showMain();

  }


  showMain(){

    this.showMainPage = true;
    this.showProfilePage = false;
    this.showDepositPage = false;
    this.showTransferPage = false;
  }

  showProfile(){
    this.showMainPage = false;
    this.showProfilePage = true;
    this.showDepositPage = false;
    this.showTransferPage = false;
  }

  makeDeposit(){

    this.showMainPage = false;
    this.showProfilePage = false;
    this.showDepositPage = true;
    this.showTransferPage = false;
  }

  makeTransfer(){
    this.showMainPage = false;
    this.showProfilePage = false;
    this.showDepositPage = false;
    this.showTransferPage = true;
  }

}




