import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ColorThemePipe} from "./color-theme.pipe";



@NgModule({
  declarations: [ColorThemePipe],
  exports: [
    ColorThemePipe
  ],
  imports: [
    CommonModule,
  ]
})
export class ColorThemePipeModule { }
