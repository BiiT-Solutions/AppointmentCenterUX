import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentCalendarComponent } from './appointment-calendar.component';
import {AppointmentCalendarRoutingModule} from "./appointment-calendar-routing.module";
import {BiitDatePickerModule, BiitInputTextModule} from "biit-ui/inputs";
import {BiitIconButtonModule} from "biit-ui/button";
import {FormsModule} from "@angular/forms";
import {BiitCalendarModule} from "biit-ui/calendar";
import {BiitPopupModule} from "biit-ui/popup";
import {AppointmentFormModule} from "../../shared/appointment-form/appointment-form.module";
import {TranslocoModule} from "@ngneat/transloco";
import {TranslocoDatePipe} from "@ngneat/transloco-locale";



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
        BiitCalendarModule,
        BiitPopupModule,
        AppointmentFormModule,
        TranslocoModule,
        TranslocoDatePipe
    ]
})
export class AppointmentCalendarModule { }
