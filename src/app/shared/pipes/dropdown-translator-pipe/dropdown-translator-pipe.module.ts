import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DropdownTranslatorPipe} from "./dropdown-translator.pipe";



@NgModule({
  declarations: [DropdownTranslatorPipe],
  exports: [
    DropdownTranslatorPipe
  ],
  imports: [
    CommonModule,
  ]
})
export class DropdownTranslatorPipeModule { }
