import { CustomerModel } from "./customer.interface";

export interface AccountModel{
  id: string;
  customerId: CustomerModel;
  accountTypeId: AccountTypeModel;
  balance: number;
  state: boolean;
  deletedAt?: Date | number;
}
export interface CreateBankAccountModel{
  customerId: string;
  accountTypeName: string;
}

export interface AccountTypeModel{
  id: string;
  name: string;
  state: boolean;
}

export interface AccountDepositModel{
  accountId: string;
  amount: number;
}

export interface AccountTransferModel{
  outcome: string;
  income: string;
  amount: number;
  reason: string;
}

export interface AccountMovementModel{
  id: string;
  accountId: string;
  destinationAccountId: string,
  amount: number;
  reason: string,
  datetime: number;
}

export interface AccountMovementTransferModel{
  id: string;
  income: string;
  outcome: string,
  amount: number;
  reason: string,
  datetime: number;
}
