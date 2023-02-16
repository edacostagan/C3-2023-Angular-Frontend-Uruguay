import { Component, OnInit } from '@angular/core';
import { CustomerModel } from 'src/app/interfaces/customer.interface';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  token: string = localStorage.getItem('token') as string;

  constructor(
    private customerService: CustomerService,

  ){}

  customerData!: CustomerModel;

  ngOnInit(): void {

    this.customerService.updateCustomerData();

    this.customerService.customerData.subscribe(value => this.customerData = value as CustomerModel);

  }

}





