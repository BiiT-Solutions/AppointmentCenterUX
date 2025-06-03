import {AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {BiitProgressBarType, BiitSnackbarService, NotificationType} from "biit-ui/info";
import {CalendarConfiguration, CalendarEvent, CalendarMode} from "biit-ui/calendar";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {
  DayOfWeek,
  Schedule,
  ScheduleRange,
  ScheduleService
} from "appointment-center-structure-lib";
import {ScheduleCalendarUtility} from "./schedule-calendar-utility";
import {CalendarEventConverter} from "../../shared/utils/calendar-event-converter.module";
import {Permission} from "../../config/rbac/permission";
import {CalendarEventTimesChangedEvent} from "angular-calendar";
import {TemplateService} from "../../services/template.service";

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
export class ScheduleCalendarComponent implements OnInit, AfterViewInit, OnDestroy {

  protected readonly CalendarMode = CalendarMode;
  protected readonly BiitProgressBarType = BiitProgressBarType;

  protected waiting: boolean = false;

  protected calendarConfiguration: CalendarConfiguration = new CalendarConfiguration(true, true);
  protected calendarUtility: ScheduleCalendarUtility;

  protected events: CalendarEvent[] = [];
  protected showCleanConfirmation: boolean = false;

  @ViewChild('template', {static: true}) template: TemplateRef<any>;

  constructor (private biitSnackbarService: BiitSnackbarService,
              private templateService: TemplateService,
              private translocoService: TranslocoService,
              private scheduleService: ScheduleService) {
    this.calendarUtility = new ScheduleCalendarUtility(translocoService);
  }

  ngOnInit(): void {
    this.waiting = true;
    this.scheduleService.getMySchedule().subscribe( {
      next: (schedule: Schedule): void => {
        this.waiting = false;
        this.refreshCalendar(schedule);
      },
      error: (error: any): void => {
        this.waiting = false;
        this.translocoService.selectTranslate('app.error-loading-schedule').subscribe( translation => {
            this.biitSnackbarService.showNotification(translation, NotificationType.ERROR, undefined, 5000);
        })
      }
    })
  }

  // Injects the template into the template service (BiitComponentMenu)
  ngAfterViewInit() {
    this.templateService.changeTemplate(this.template);
  }

  // Removes the template from the template service (BiitComponentMenu)
  ngOnDestroy() {
    this.templateService.changeTemplate(undefined);
  }

  refreshCalendar(schedule: Schedule) {
    this.events = [];
    if (schedule) {
      this.events = schedule.ranges.map(r => {
        return CalendarEventConverter.convertRangeToCalendarEvent(r);
      })
    }
  }


  onEventCreated(calendarEvent: CalendarEvent) {
    if (calendarEvent) {
      const scheduleRange = new ScheduleRange();
      scheduleRange.dayOfWeek = DayOfWeek.getByNumber(calendarEvent.start.getDay());
      scheduleRange.startTime = `${calendarEvent.start.getHours().toString().padStart(2, '0')}:${calendarEvent.start.getMinutes().toString().padStart(2, '0')}`;
      scheduleRange.endTime = `${calendarEvent.end.getHours().toString().padStart(2, '0')}:${calendarEvent.end.getMinutes().toString().padStart(2, '0')}`;

      const scheduleRanges: ScheduleRange[] = [];
      scheduleRanges.push(scheduleRange);
      this.waiting = true;
      this.scheduleService.addRangesToMySchedule(scheduleRanges).subscribe(
        {
          next: (schedule: Schedule): void => {
            this.waiting = false;
            this.refreshCalendar(schedule);
          },
          error: (error: any): void => {
            this.waiting = false;
            this.translocoService.selectTranslate('app.error-updating-schedule').subscribe( translation => {
              this.biitSnackbarService.showNotification(translation, NotificationType.ERROR, undefined, 5000);
            })
          }
        }
      );
    }
  }
  onDeleteEvent(calendarEvent: CalendarEvent) {
    const scheduleRange = new ScheduleRange();
    scheduleRange.dayOfWeek = DayOfWeek.getByNumber(calendarEvent.start.getDay());
    scheduleRange.startTime = `${calendarEvent.start.getHours().toString().padStart(2, '0')}:${calendarEvent.start.getMinutes().toString().padStart(2, '0')}`;
    scheduleRange.endTime = `${calendarEvent.end.getHours().toString().padStart(2, '0')}:${calendarEvent.end.getMinutes().toString().padStart(2, '0')}`;
    this.scheduleService.deleteRangesFromMySchedule([scheduleRange]).subscribe({
      next: (schedule: Schedule): void => {
        this.waiting = false;
        this.refreshCalendar(schedule);
      },
      error: (error: any): void => {
        this.waiting = false;
        this.translocoService.selectTranslate('app.error-updating-schedule').subscribe( translation => {
          this.biitSnackbarService.showNotification(translation, NotificationType.ERROR, undefined, 5000);
        })
      }
    })
  }
  protected readonly Permission = Permission;

  protected clearSchedules() {
    this.waiting = true;
    this.scheduleService.setMySchedule([]).subscribe(
      {
        next: (schedule: Schedule): void => {
          this.waiting = false;
          this.refreshCalendar(schedule);
        },
        error: (error: any): void => {
          this.waiting = false;
          this.translocoService.selectTranslate('app.error-updating-schedule').subscribe( translation => {
            this.biitSnackbarService.showNotification(translation, NotificationType.ERROR, undefined, 5000);
          })
        }
      }
    )
  }
  protected onEventDrop(event: CalendarEventTimesChangedEvent): void {
    const scheduleRange = new ScheduleRange();
    scheduleRange.dayOfWeek = DayOfWeek.getByNumber((new Date(event.newStart)).getDay());
    scheduleRange.startTime = new Date(event.newStart).getHours().toString().padStart(2, '0') + ':' + new Date(event.newStart).getMinutes().toString().padStart(2, '0');
    scheduleRange.endTime = new Date(event.newEnd).getHours().toString().padStart(2, '0') + ':' + new Date(event.newEnd).getMinutes().toString().padStart(2, '0');
    scheduleRange.id = +event.event.id;
    // TODO: sent event once update and existing schedule endpoint is created.
    console.log('Drop', event);
  }
}
