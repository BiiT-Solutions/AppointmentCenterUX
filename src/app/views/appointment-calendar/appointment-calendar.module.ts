import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentCalendarComponent } from './appointment-calendar.component';
import {AppointmentCalendarRoutingModule} from "./appointment-calendar-routing.module";
import {BiitDatePickerModule, BiitInputTextModule} from "biit-ui/inputs";
import {BiitIconButtonModule} from "biit-ui/button";
import {FormsModule} from "@angular/forms";
import {BiitCalendarModule} from "biit-ui/calendar";



@NgModule({
  declarations: [
    AppointmentCalendarComponent
  ],
  imports: [
    CommonModule,
    AppointmentCalendarRoutingModule,
    BiitInputTextModule,
    BiitIconButtonModule,
    BiitDatePickerModule,
    FormsModule,
    BiitCalendarModule
  ]
})
export class AppointmentCalendarModule { }
