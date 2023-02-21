import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule } from "@auth0/angular-jwt";


//Modules
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './components/shared/shared.module';
import { MaterialModule } from './components/shared/material/material.module';
import { LoginModule } from './components/login/login.module';


//Components
import { AppComponent } from './app.component';
import { SigninModule } from './components/sign-in/sign-in.module';
import { SignupModule } from './components/sign-up/sign-up.module';
import { BrowserModule } from '@angular/platform-browser';
import { DesktopComponent } from './components/desktop/desktop.component';
import { DesktopModule } from './components/desktop/desktop.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { ConfirmDialogComponent } from './components/shared/confirm-dialog/confirm-dialog.component';
import { HttpInterceptorService } from './interceptors/http-interceptor.service';


@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    SharedModule,
    AppRoutingModule,
    LoginModule,
    JwtModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    }],
  entryComponents: [
    ConfirmDialogComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
