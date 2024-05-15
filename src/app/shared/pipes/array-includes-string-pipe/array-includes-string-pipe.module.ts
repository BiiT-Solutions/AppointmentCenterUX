import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ArrayIncludesStringListPipe} from "./array-includes-string-list.pipe";

@NgModule({
  declarations: [ArrayIncludesStringListPipe],
  exports: [
    ArrayIncludesStringListPipe
  ],
  imports: [
    CommonModule
  ]
})
export class ArrayIncludesStringPipeModule { }
