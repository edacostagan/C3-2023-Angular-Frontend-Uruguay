import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  loggedUser!: boolean ;

  constructor(
    public authService: AuthService,
    private router: Router,
    public appComp: AppComponent,
  ) { }


  ngOnInit() {

    this.authService.loggedUser.subscribe(currentStatus => this.loggedUser = currentStatus);
  }

  /**
   * Set the conditions to end the user service
   * and exit the desktop
   */
  logout() {

    this.clearAllSessionData();
    this.appComp.toHome();
    this.router.navigate(["/"]);

  }

  clearAllSessionData(){
    localStorage.clear();
    this.authService.setUserLogStatus(false);
    this.authService.setPublicZoneStatus(true);
    this.authService.setUserAccessPermits(false);
  }

}
