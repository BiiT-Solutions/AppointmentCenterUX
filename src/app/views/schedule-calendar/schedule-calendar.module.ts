import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduleCalendarRoutingModule } from './schedule-calendar-routing.module';
import { ScheduleCalendarComponent } from './schedule-calendar.component';
import {BiitCalendarModule} from "biit-ui/calendar";
import {BiitProgressBarModule, BiitTooltipModule} from "biit-ui/info";
import {TranslocoModule} from "@ngneat/transloco";
import {DragAndDropModule} from "angular-draggable-droppable";
import {ColorThemePipeModule} from "../../shared/pipes/color-theme-event/color-theme-pipe.module";
import {ContextMenuModule} from "@perfectmemory/ngx-contextmenu";
import {HasPermissionPipeModule} from "../../shared/pipes/has-permission-pipe/has-permission-pipe.module";
import {BiitIconButtonModule} from "biit-ui/button";


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
    ContextMenuModule,
    HasPermissionPipeModule,
    BiitIconButtonModule,
    BiitTooltipModule,
  ]
})
export class ScheduleCalendarModule { }
