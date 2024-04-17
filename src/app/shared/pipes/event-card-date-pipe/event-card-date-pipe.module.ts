import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EventCardDatePipe} from "./event-card-date.pipe";

@NgModule({
  declarations: [EventCardDatePipe],
  exports: [
    EventCardDatePipe
  ],
  imports: [
    CommonModule,
  ]
})
export class EventCardDatePipeModule { }
