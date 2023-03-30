import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  exports: [
    MatExpansionModule,
    MatIconModule,
    MatDividerModule
  ]
})
export class MaterialModule { }
