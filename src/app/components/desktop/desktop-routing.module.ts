import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DesktopComponent } from './desktop.component';
import { ProfileComponent } from './profile/profile.component';
import { MainComponent } from './main/main.component';


const desktopRoutes: Routes = [

  { path: '', pathMatch: 'full' },
  { path: '', component: MainComponent },
  { path: 'desktop/profile', component: ProfileComponent },



]

@NgModule({
  imports: [RouterModule.forChild(desktopRoutes)],
  exports: [RouterModule]
})
export class DesktopRoutingModule { }
