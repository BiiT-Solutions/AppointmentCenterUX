import {Component, OnInit} from '@angular/core';
import {BiitProgressBarType, BiitSnackbarService} from "biit-ui/info";
import {CalendarConfiguration, CalendarEvent, CalendarMode} from "biit-ui/calendar";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {
  AppointmentService,
  DayOfWeek,
  Schedule,
  ScheduleRange,
  ScheduleService
} from "appointment-center-structure-lib";
import {PermissionService} from "../../services/permission.service";
import {ScheduleCalendarUtility} from "./schedule-calendar-utility";
import {CalendarEventConverter} from "../../shared/utils/calendar-event-converter.module";

@Component({
  selector: 'schedule-calendar',
  templateUrl: './schedule-calendar.component.html',
  styleUrls: ['./schedule-calendar.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi: true,
      useValue: {scope: 'components/appointment_center', alias: 'app'}
    }
  ]
})
export class ScheduleCalendarComponent implements OnInit {

  protected readonly CalendarMode = CalendarMode;
  protected readonly BiitProgressBarType = BiitProgressBarType;

  protected waiting: boolean = false;

  protected calendarConfiguration: CalendarConfiguration = new CalendarConfiguration(true, true);
  protected calendarUtility: ScheduleCalendarUtility;

  protected events: CalendarEvent[] = [];

  constructor(private appointmentService: AppointmentService,
              protected permissionService: PermissionService,
              private biitSnackbarService: BiitSnackbarService,
              private translocoService: TranslocoService,
              private scheduleService: ScheduleService) {
    this.calendarUtility = new ScheduleCalendarUtility(translocoService);
  }


  ngOnInit(): void {
    this.scheduleService.getMySchedule().subscribe((_schedule: Schedule): void => {
      this.refreshCalendar(_schedule);
    })
  }


  refreshCalendar(schedule: Schedule) {
    this.events = [];
    if (schedule) {
      this.events = schedule.ranges.map(r => {
        return CalendarEventConverter.convertRangeToCalendarEvent(r);
      })
    }
  }


  onEventChange(calendarEvent: CalendarEvent) {
    if (calendarEvent) {
      const scheduleRange = new ScheduleRange();
      scheduleRange.dayOfWeek = DayOfWeek.getByNumber(calendarEvent.start.getDay());
      scheduleRange.startTime = `${calendarEvent.start.getHours().toString().padStart(2, '0')}:${calendarEvent.start.getMinutes().toString().padStart(2, '0')}`;
      scheduleRange.endTime = `${calendarEvent.end.getHours().toString().padStart(2, '0')}:${calendarEvent.end.getMinutes().toString().padStart(2, '0')}`;

      const scheduleRanges: ScheduleRange[] = [];
      scheduleRanges.push(scheduleRange);
      this.scheduleService.addRangesToMySchedule(scheduleRanges).subscribe((_schedule: Schedule): void => {
        this.refreshCalendar(_schedule);
      })
    }
  }
}
