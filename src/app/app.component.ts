import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogModel } from './components/shared/confirm-dialog/confirm-dialog.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  {

  constructor(
    public authService: AuthService,

  ){}

  isLoggingIn: boolean = false;
  isRegistering: boolean = false;
  isGoingHome: boolean = true;


  toLogin(){
    this.isLoggingIn = true;
    this.isRegistering = false;
    this.isGoingHome=false;
  }

  toRegister(){
    this.isLoggingIn = false;
    this.isRegistering = true;
    this.isGoingHome=false;
  }

  toHome(){
    this.isLoggingIn=false;
    this.isRegistering=false;
    this.isGoingHome=true;
  }

}
