import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, } from '@angular/fire/auth';
import { BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  provider = new GoogleAuthProvider();

  userHasAccess: boolean = false;

  loggedUser: BehaviorSubject<boolean> = new BehaviorSubject(false);

  publicZone: BehaviorSubject<boolean> = new BehaviorSubject(true);


  /**
   * sets the user log status
   */
  setUserLogStatus(status: boolean) {
    this.loggedUser.next(status);
  }

  /**
   * Sets if is public zone or restricted zone
   */
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


  // Returns access permits to desktop for current user
  getUserAccessPermits(): boolean {
    return this.userHasAccess;
  }

  // Sets access permits to desktop for current user
  setUserAccessPermits(status: boolean) {
    this.userHasAccess = status;
  }
}

