import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
  NgxMatNativeDateModule,
} from '@angular-material-components/datetime-picker';

@NgModule({
  imports: [
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule,
    ReactiveFormsModule,
  ],
  exports: [
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule,
    ReactiveFormsModule,
  ],
  providers: [],
})
export class AngularMaterialModule {}
