import { Component } from '@angular/core';
import { filter, from, map } from 'rxjs';
import { CustomerModel } from 'src/app/interfaces/customer.interface';
import { baseCustomers } from '../customer-data/customer-data';

@Component({
  selector: 'app-ejercicio',
  templateUrl: './ejercicio.component.html',
  styleUrls: ['./ejercicio.component.scss']
})
export class EjercicioComponent {



  /**
   * Aplicar 6 transformaciones de datos 3 con observables y 3 sin.
   * Se deben usar 2 operadores funcionales para cada transformacion.
   *
   * Se debe crear una funcion pura, ademas de la que dio el coach
   *
   * A partir de la funcion pura crear una composicion de funciones y
   * una funcion de orden superior o un callback.
   *
   * Funcion de orden superior: Tomar una o más funciones como entrada y Devolver una función como salida
   * Comopsicion de funciones: Componer funciones se basa en combinar funciones simples para construir funciones más complicadas
   */


  constructor() {

    this.findById("a21s2d2w2");

  }

  public customers: CustomerModel[] = baseCustomers;

  disabledUsers: string[] = [];

  newData!: CustomerModel;

  currentUser: string = "";



  //--------> Observables

  /**
   * return the element that matches the document provided
   * @param document document to search for
   */
  transform(document: string) {
    from(this.customers).pipe(
      filter(n => n.document === document),
    ).subscribe((data) => this.newData = data)
  }


  /**
     * Look for an Id key trough the array, if found, assign the object to a variable
     * @param id id key to search
     */
  findById(id: string) {
    from(this.customers).pipe(
      filter(i => i.id === id && i.state === true),
      map(i => `Customer with ID: ${id} - ${i.fullname} Found!`),
    ).subscribe((data) => this.currentUser = data)
  }


  /**
   * Find all customers with state False
   * @returns array of strings
   */
  findDisabledCustomers() {
    from(this.customers).pipe(
      filter(i => i.state === false),
      map(i => `Id: ${i.id} - Is Disabled!`),
    ).subscribe(data => this.disabledUsers.push(data));


    return this.disabledUsers;
  }



  //--------> Not Observables

  /**
   * check the email and return the ones that matches the query
   * @param provider text to search
   */
  findByEmailProvider(provider: string): string[] {

    return this.customers.filter(i => i.email.includes(provider) === true && i.state === true)
      .map(i => `Id: ${i.id} has the email: ${i.email}`);
  }

  /**
     * Function that returns an array of names and Id's
     * Next, it passes that info to another function that uses the data
     *
     * @param customers array of Customers
     * @param fn function that manages the results ( array of strings )
     */
  getCustomersFullNameAndId(customers: CustomerModel[], fn: (str: string[]) => string) {

    const customersInfo = customers.map(c => `Customer: ${c.fullname} has de Document: ${c.document} `);
    return fn(customersInfo);
  }

  /**
   * Take a customerArray and sort the info
   * @param customerList array of customers
   * @returns sorted array
   */
  sortCustomers(customerList: readonly string[]): string {

    let sortedList = [...customerList].sort();

    return (sortedList.reduce(function (prev, curr) { return prev.concat(" - " + curr) })
    ).toString();

  }

  /**
   * shows the info of the current CustomerModel element
   * @returns String
   */
  public showCurrentElement(): string {

    return this.customerFullDataString(this.newData);

  }


  /**
   * Take a CustomerModel entity and convert it to a String
   * @param customer customer Data to convert
   * @returns string of data
   */
  customerFullDataString(customer: CustomerModel): string {

    return (Object.values(customer)
      .reduce(function (prev, curr) { return prev.concat(" - " + curr) })
    ).toString();
  }


  /**
   * Convert the string given to Upper case
   * @param data string to convert
   * @returns a string converted
   */
  allDataToUpper(data: string): string {
    return data.toUpperCase();
  }


  /**
   * Search for a customer by the document and return an string of data
   * @param document document to search
   * @returns string with all the data of the customer found
   */
  showCustomerData(document: string): string {

    this.transform(document); // find the customer
    return this.customerFullDataString(this.newData);

  }

  /**
   * return an array of Id and fullnames of customers
   * @returns array of strings
   */
  public showIdAndFullnameAllCustomers(list: CustomerModel[]): string[] {
    return list.map(e => `ID: ${e.id} -> Name: ${e.fullname} `);
  }

  getAllEmails(customers: CustomerModel[]): string[] {
    const emails: string[] = [];
    customers.forEach((data) => {
      emails.push(data.email);
    });
    return emails;
  }



  /**
   * Take 2 values and return the sum of them
   * @param a value 1
   * @param b value 2
   * @returns sum of value 1 and vale 2
   */
  public sum(a: number, b: number): number {

    return a + b;

  }
}
