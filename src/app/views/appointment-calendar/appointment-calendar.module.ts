import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentCalendarComponent } from './appointment-calendar.component';
import {AppointmentCalendarRoutingModule} from "./appointment-calendar-routing.module";
import {BiitDatePickerModule, BiitInputTextModule} from "biit-ui/inputs";
import {BiitButtonModule, BiitIconButtonModule} from "biit-ui/button";
import {FormsModule} from "@angular/forms";
import {BiitCalendarModule} from "biit-ui/calendar";
import {BiitPopupModule} from "biit-ui/popup";
import {AppointmentFormModule} from "../../shared/forms/appointment-form/appointment-form.module";
import {TranslocoModule} from "@ngneat/transloco";
import {TranslocoDatePipe} from "@ngneat/transloco-locale";
import {TimeDurationPipeModule} from "../../shared/pipes/time-duration-pipe/time-duration-pipe.module";
import {SpeakerListPipeModule} from "../../shared/pipes/speaker-list-pipe/speaker-list-pipe.module";
import {DragAndDropModule} from "angular-draggable-droppable";
import {WorkshopFormModule} from "../../shared/forms/workshop-form/workshop-form.module";
import {ContextMenuModule} from "@perfectmemory/ngx-contextmenu";



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
        TranslocoDatePipe,
        TimeDurationPipeModule,
        SpeakerListPipeModule,
        DragAndDropModule,
        WorkshopFormModule,
        ContextMenuModule,
        BiitButtonModule
    ]
})
export class AppointmentCalendarModule { }
