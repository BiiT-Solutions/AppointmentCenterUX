import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentCalendarComponent } from './appointment-calendar.component';
import {AppointmentCalendarRoutingModule} from "./appointment-calendar-routing.module";
import {BiitDatePickerModule, BiitDropdownModule, BiitInputTextModule} from "@biit-solutions/wizardry-theme/inputs";
import {BiitButtonModule, BiitIconButtonModule} from "@biit-solutions/wizardry-theme/button";
import {FormsModule} from "@angular/forms";
import {BiitCalendarModule} from "@biit-solutions/wizardry-theme/calendar";
import {BiitPopupModule} from "@biit-solutions/wizardry-theme/popup";
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
import {BiitProgressBarModule} from "@biit-solutions/wizardry-theme/info";
import {
  ArrayIncludesStringPipeModule
} from "../../shared/pipes/array-includes-string-pipe/array-includes-string-pipe.module";
import {DropdownInterfacePipeModule} from "../../shared/pipes/dropdown-interface-pipe/dropdown-interface-pipe.module";
import {BiitIconModule} from "@biit-solutions/wizardry-theme/icon";
import {WorkshopCardModule} from "../../shared/components/workshop-card/workshop-card.module";
import {ExternalCalendarFormModule} from "../../shared/forms/external-calendar-form/external-calendar-form.module";



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
        ArrayIncludesStringPipeModule,
        BiitDropdownModule,
        DropdownInterfacePipeModule,
        BiitIconModule,
        WorkshopCardModule,
        ExternalCalendarFormModule
    ]
})
export class AppointmentCalendarModule { }
