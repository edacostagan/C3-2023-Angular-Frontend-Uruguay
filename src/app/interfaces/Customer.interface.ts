export interface CustomerModel {
  id: string;
  documentType: DocumentTypeModel;
  document: string;
  fullname: string;
  email: string;
  phone: string;
  password: string;
  avatarUrl?: string;
  state: boolean;
  deletedAt?: Date | number;

}

export interface UpdateCustomerModel {

   documentTypeId: string;
    document: string;
    fullname: string;
    email: string;
    phone: string;
    password: string;
    state: boolean;
    avatarUrl: string;

}
export interface DocumentTypeModel {
  id: string;
  name: string;
  state: boolean;
}

export interface CustomerSignInModel {
  username: string;
  password: string;
}


export interface CustomerSignUpModel {

    documentType: string;
    document: string;
    fullname: string;
    email: string;
    phone: string;
    password: string;
    accountTypeName: string;
}
