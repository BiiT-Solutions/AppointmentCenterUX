import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TimeDurationPipe} from "./time-duration.pipe";



@NgModule({
  declarations: [TimeDurationPipe],
  exports: [
    TimeDurationPipe
  ],
  imports: [
    CommonModule,
  ]
})
export class TimeDurationPipeModule { }
