import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduleCalendarRoutingModule } from './schedule-calendar-routing.module';
import { ScheduleCalendarComponent } from './schedule-calendar.component';
import {BiitCalendarModule} from "biit-ui/calendar";
import {BiitProgressBarModule} from "biit-ui/info";
import {TranslocoModule} from "@ngneat/transloco";
import {DragAndDropModule} from "angular-draggable-droppable";
import {ColorThemePipeModule} from "../../shared/pipes/color-theme-event/color-theme-pipe.module";


@NgModule({
  declarations: [
    ScheduleCalendarComponent
  ],
  imports: [
    CommonModule,
    ScheduleCalendarRoutingModule,
    BiitCalendarModule,
    BiitProgressBarModule,
    TranslocoModule,
    DragAndDropModule,
    ColorThemePipeModule,
  ]
})
export class ScheduleCalendarModule { }
