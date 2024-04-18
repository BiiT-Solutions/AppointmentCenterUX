import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {EventCardDatePipe} from "./event-card-date.pipe";

@NgModule({
  declarations: [EventCardDatePipe],
  exports: [
    EventCardDatePipe
  ],
  imports: [
    CommonModule,
    DatePipe
  ],
  providers: [
    DatePipe
  ]
})
export class EventCardDatePipeModule { }
