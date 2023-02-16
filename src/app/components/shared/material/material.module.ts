import { NgModule } from '@angular/core';

import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule} from '@angular/material/snack-bar';
import { MatGridListModule} from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';


const component = [
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatButtonModule,
  MatMenuModule,
  MatIconModule,
  MatToolbarModule,
  MatInputModule,
  MatSidenavModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatGridListModule,
  MatTableModule,
  MatTooltipModule,
  MatPaginatorModule,

];


@NgModule({
  declarations: [],
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatInputModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,

  ],
  exports: [
    component
  ]
})
export class MaterialModule { }
