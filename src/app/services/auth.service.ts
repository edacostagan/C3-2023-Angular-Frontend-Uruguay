import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, } from '@angular/fire/auth';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { CustomerModel } from '../interfaces/customer.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  provider = new GoogleAuthProvider();

  userHasAccess: boolean = false;

  loggedUser: BehaviorSubject<boolean> = new BehaviorSubject(false);

  publicZone: BehaviorSubject<boolean> = new BehaviorSubject(true);


  setUserLogStatus(status: boolean) {
    this.loggedUser.next(status);
  }

  setPublicZoneStatus(status: boolean) {
    this.publicZone.next(status);
  }


  constructor(
    private auth: Auth,

  ) { }



  /**
   * Used to login with Firebase
   * @returns Promise Token
   */
  loginWithFirebase() {

    return signInWithPopup(this.auth, this.provider)
  }

  /**
   * User to make a registration of new user with Firebase
   * @param email
   * @param pass
   * @returns promise
   */
  registerWithFirebase(email: string, pass: string) {

    return from(createUserWithEmailAndPassword(this.auth, email, pass))
  }


  // Returns access permits to desktop for current user
  getUserAccessPermits(): boolean {
    return this.userHasAccess;
  }

  // Sets access permits to desktop for current user
  setUserAccessPermits(status: boolean) {
    this.userHasAccess = status;
  }



  /*
  public setIsPublicZone(status: boolean) {
    this.isInPublicZone = status;
  }

  /**

  public getIsPublicZone(): boolean {
    return this.isInPublicZone;
  }

  /**
   * Sets the status of the user ( login )
   * @pa
  public setUserStatus(status: boolean) {
    this.userIsLogged = status;
  }

  /**
   * return the status of the user ( login )
   * @returns boolean with the status of the user

  public getUserStatus(): boolean {
    return this.userIsLogged;
  } */
}

