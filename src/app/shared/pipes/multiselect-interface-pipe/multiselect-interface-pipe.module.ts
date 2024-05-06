import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MultiselectInterfacePipe} from "./multiselect-interface.pipe";



@NgModule({
  declarations: [MultiselectInterfacePipe],
  exports: [
    MultiselectInterfacePipe
  ],
  imports: [
    CommonModule,
  ]
})
export class MultiselectInterfacePipeModule { }
