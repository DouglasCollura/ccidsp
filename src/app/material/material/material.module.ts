import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatTableModule} from '@angular/material/table';
import {MatMenuModule} from '@angular/material/menu';
import {MatDialogModule} from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatStepperModule} from '@angular/material/stepper';
import {MatChipsModule} from '@angular/material/chips';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  exports: [
    MatExpansionModule,
    MatIconModule,
    MatDividerModule,
    MatTableModule,
    MatMenuModule,
    MatDialogModule,
    MatPaginatorModule,
    MatStepperModule,
    MatChipsModule
  ]
})
export class MaterialModule { }
