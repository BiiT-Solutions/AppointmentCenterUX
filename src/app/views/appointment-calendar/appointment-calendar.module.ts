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
import {UserNameListPipeModule} from "../../shared/pipes/user-name-list-pipe/user-name-list-pipe.module";
import {DragAndDropModule} from "angular-draggable-droppable";
import {WorkshopFormModule} from "../../shared/forms/workshop-form/workshop-form.module";
import {ContextMenuModule} from "@perfectmemory/ngx-contextmenu";
import {EventCardModule} from "../../shared/components/event-card/event-card.module";
import {HasPermissionPipeModule} from "../../shared/pipes/has-permission-pipe/has-permission-pipe.module";
import {ColorThemePipeModule} from "../../shared/pipes/color-theme-event/color-theme-pipe.module";
import {BiitProgressBarModule} from "biit-ui/info";
import {
  ArrayIncludesStringPipeModule
} from "../../shared/pipes/array-includes-string-pipe/array-includes-string-pipe.module";



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
    UserNameListPipeModule,
    DragAndDropModule,
    WorkshopFormModule,
    ContextMenuModule,
    BiitButtonModule,
    EventCardModule,
    HasPermissionPipeModule,
    ColorThemePipeModule,
    BiitProgressBarModule,
    ArrayIncludesStringPipeModule
  ]
})
export class AppointmentCalendarModule { }
