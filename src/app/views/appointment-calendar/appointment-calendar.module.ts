import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentCalendarComponent } from './appointment-calendar.component';
import {AppointmentCalendarRoutingModule} from "./appointment-calendar-routing.module";



@NgModule({
  declarations: [
    AppointmentCalendarComponent
  ],
  imports: [
    CommonModule,
    AppointmentCalendarRoutingModule
  ]
})
export class AppointmentCalendarModule { }
