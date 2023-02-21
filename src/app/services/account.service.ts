import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountDepositModel, AccountMovementModel, AccountTransferModel, CreateBankAccountModel, AccountMovementTransferModel } from '../interfaces/account.interface';
import { TokenResponseModel } from '../interfaces/responses.interface';

@Injectable({
  providedIn: 'root'
})
export class AccountService {



  deposits: AccountMovementModel[] = [];
  transfers: AccountMovementTransferModel[] = [];

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

  registerNewTransfer(transfer: AccountTransferModel): Observable<TokenResponseModel> {

    return this.http.post<TokenResponseModel>(`${environment.API_URL}/transfer/register`, transfer);

  }

  /**
   * Creates a new bank account
   * @param newAccount
   */
  createNewBankAccount(newAccount: CreateBankAccountModel) {

    this.http.post(`${environment.API_URL}/account/create/`, newAccount);

  }



  /**
   * Clear all cached movements
   */
  clearAccountMovements() {
    this.deposits = [];
    this.transfers = [];
  }
  /**
   * Gets all the incoming deposits to the given account id
   */
  getDepositsToCurrentAccount(id: string) {

    this.http.get<AccountMovementModel[]>(`${environment.API_URL}/deposit/${id}`)
      .subscribe(result => {

        this.deposits = result;
      })
  }

  /**
   * Gets all the transfers to and from the given account id
   */
  getTransferToCurrentAccount(id: string) {

    this.http.get<AccountMovementTransferModel[]>(`${environment.API_URL}/transfer/getAll/${id}`)
      .subscribe(result => {
        this.transfers = result;
      })
  }

}
