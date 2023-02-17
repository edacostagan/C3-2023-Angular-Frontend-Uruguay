import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MaterialModule } from './material/material.module';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,


  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    HttpClientModule
  ],
  exports:[
    NavbarComponent,
    FooterComponent,
    RouterModule,
    HttpClientModule
  ]
})
export class SharedModule { }
