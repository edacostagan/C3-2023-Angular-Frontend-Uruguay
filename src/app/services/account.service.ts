import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountDepositModel, AccountMovementModel, CreateBankAccountModel } from '../interfaces/account.interface';
import { TokenResponseModel } from '../interfaces/responses.interface';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private http: HttpClient,
  ) { }

  /**
   * Makes a request to Backend to register a new customer
   * @param customer customer entity data
   * @returns validation token
   */
  registerNewDeposit(deposit: AccountDepositModel): Observable<TokenResponseModel> {

    return this.http.post<TokenResponseModel>(`${environment.API_URL}/deposit/register`, deposit);

  }

  /**
   * Creates a new bank account
   * @param newAccount
   */
  createNewBankAccount(newAccount: CreateBankAccountModel) {

    console.log(newAccount)

    const res = this.http.post(`${environment.API_URL}/account/create`, newAccount);

    console.log(res)
  }

  /**
   * Gets all the incoming deposits to the given account id
   */
  getDepositsToCurrentAccount(id: string) {

    this.http.get<AccountMovementModel[]>(`${environment.API_URL}/deposit/${id}`)
      .subscribe(result => {
        localStorage.setItem('accountMovements', JSON.stringify(result));
      }
      )
  }

}
