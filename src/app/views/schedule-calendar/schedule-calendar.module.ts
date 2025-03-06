import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduleCalendarRoutingModule } from './schedule-calendar-routing.module';
import { ScheduleCalendarComponent } from './schedule-calendar.component';


@NgModule({
  declarations: [
    ScheduleCalendarComponent
  ],
  imports: [
    CommonModule,
    ScheduleCalendarRoutingModule
  ]
})
export class ScheduleCalendarModule { }
