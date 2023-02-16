import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

// Interfaces
import { CustomerSignInModel, CustomerSignUpModel, CustomerModel } from '../interfaces/customer.interface';
import { Observable, BehaviorSubject } from 'rxjs';
import { TokenResponseModel as TokenResponseModel } from '../interfaces/responses.interface';
import { AccountModel } from '../interfaces/account.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  customerData: BehaviorSubject<{}> = new BehaviorSubject({});
  customerAccounts: BehaviorSubject<[]> = new BehaviorSubject([]);
  customerTotalBalance: BehaviorSubject<number> = new BehaviorSubject(0);

  customerId: BehaviorSubject<string> = new BehaviorSubject("");
  customerName: BehaviorSubject<string> = new BehaviorSubject("");
  customerAvatarURL: BehaviorSubject<string> = new BehaviorSubject("");

  customerID: string = localStorage.getItem("customerID") as string;
  accounts!: AccountModel[];

  constructor(
    private http: HttpClient,
  ) { }


  updateCustomerId(newId: string) {
    this.customerId.next(newId);
  }

  updateCustomerName(newName: string) {

    this.customerName.next(newName);
  }

  updateCustomerAvatarURL(newUrl: string) {
    this.customerAvatarURL.next(newUrl);
  }

  /**
     * Gets de Customer information data from localstorage
     * and parse it into an array
     * The info changes are monitored by a state Management
     */
  updateCustomerData() {

    const customer = localStorage.getItem("customer");

    if (customer == null) {
      this.getCustomerData(this.customerID);
    }
    if (customer != null) {
      this.accounts = JSON.parse(customer)
      this.customerData.next(this.accounts);
    }
  }

  /**
     * Gets the user accounts data from localstorage
     * and parse it into an manageable array
     * The info changes are monitored by a state Management
     */
  updateCustomerAccounts() {


    this.getCustomerAccounts(this.customerID);

    const data = localStorage.getItem("accounts");

    if (data != null) {
      this.accounts = JSON.parse(data);

      this.customerAccounts.next(JSON.parse(data))

      this.updateTotalBalance();
    }
  }

  updateTotalBalance() {

    let balance=0;
    this.accounts.forEach(element => {

      balance += element.balance;
    });

    this.customerTotalBalance.next(balance);

  }

  /**
   * Makes a request to Backend to register a new customer
   * @param customer customer entity data
   * @returns validation token
   */
  addNewCustomer(customer: CustomerSignUpModel): Observable<TokenResponseModel> {

    return this.http.post<TokenResponseModel>(`${environment.API_URL}/security/signup`, customer);
  }

  /**
   * Makes a request to backend with customer credentials
   */
  customerSignin(customer: CustomerSignInModel): Observable<TokenResponseModel> {

    return this.http.post<TokenResponseModel>(`${environment.API_URL}/security/signin`, customer);

  }

  /**
   * Get the information of the customer by a given id
   * @param id id to search
   */
  getCustomerData(id: string) {


    this.http.get(`${environment.API_URL}/customer/${id}`, {})
      .subscribe({
        next: (response) => {

          const responseValue: CustomerModel = response as CustomerModel;

          localStorage.setItem("customer", JSON.stringify(responseValue));
        },
      })

  }

  /**
   * Search the database for the customer with the given email
   * @param email data to be found
   * @returns
   */
  findCustomerByEmail(email: string): Observable<TokenResponseModel> {

    return this.http.get<TokenResponseModel>(`${environment.API_URL}/customer/email/${email}`)

  }
  /**
   * get the list of accounts of the customer with the given id
   * @param id id to be search for
   */
  getCustomerAccounts(id: string) {

    this.http.get<AccountModel>(`${environment.API_URL}/account/customer/${id}`, {})
      .subscribe({
        next: (response) => {

          const responseValue: AccountModel[] = response as unknown as AccountModel[];

          localStorage.setItem("accounts", JSON.stringify(responseValue));
        },
      })
  }
}
