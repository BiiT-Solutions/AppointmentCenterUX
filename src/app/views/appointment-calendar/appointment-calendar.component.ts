import {Component, OnInit} from '@angular/core';
import {CalendarEvent, CalendarMode} from "biit-ui/calendar";
import {
  Appointment,
  AppointmentTemplate,
  AppointmentService,
  AppointmentTemplateService
} from "appointment-center-structure-lib";
import {CalendarEventConversor} from "../../utils/calendar-event-conversor";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {CalendarEventTimesChangedEvent, CalendarEventTimesChangedEventType} from "angular-calendar";

@Component({
  selector: 'appointment-calendar',
  templateUrl: './appointment-calendar.component.html',
  styleUrls: ['./appointment-calendar.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/appointment_center', alias: 'app'}
    }
  ]
})
export class AppointmentCalendarComponent {
  protected viewDate: Date = new Date();
  protected events: CalendarEvent[] = [];
  protected workshops: AppointmentTemplate[] = [];
  protected readonly CalendarMode = CalendarMode;
  protected waiting: boolean = false;

  protected targetEvent: CalendarEvent;

  constructor(private appointmentService: AppointmentService,
              private templateService: AppointmentTemplateService,
              private biitSnackbarService: BiitSnackbarService,
              private translocoService: TranslocoService) {
    this.loadWorkshops();
    this.nextData();
  }

  protected loadWorkshops() {
    this.templateService.getAll().subscribe({
      next: (templates: AppointmentTemplate[]) => {
        this.workshops = templates;
      },
      error: (response: any) => {
        const error: string = response.status.toString();
        // Transloco does not load translation files. We need to load it manually;
        this.translocoService.selectTranslate(error, {},  {scope: 'components/appointment_center'}).subscribe(msg => {
          this.biitSnackbarService.showNotification(msg, NotificationType.ERROR, null, 5);
        });
      }
    })
  }

  protected nextData(): void {
    this.waiting = true;
    this.appointmentService.getAll().subscribe({
      next: (appointments: Appointment[]) => {
        this.events = appointments.map(CalendarEventConversor.convertToCalendarEvent);
        this.waiting = false;
      },
      error: (response: any) => {
        const error: string = response.status.toString();
        // Transloco does not load translation files. We need to load it manually;
        this.translocoService.selectTranslate(error, {},  {scope: 'components/appointment_center'}).subscribe(msg => {
          this.biitSnackbarService.showNotification(msg, NotificationType.ERROR, null, 5);
        });
        this.waiting = false;
      }
    });
  }

  onEventDrop(event: CalendarEventTimesChangedEvent) {
    switch (event.type) {
      case CalendarEventTimesChangedEventType.Drag:
        if (event.newStart.toString() !== event.event.start.toString()) {
          this.appointmentService.getById(+event.event.id).subscribe(appointment => {
            appointment.startTime = event.newStart;
            appointment.endTime = event.newEnd;
            this.appointmentService.update(appointment).subscribe(newAppointment => {
              this.events.find(e => e.id == event.event.id).start = new Date(event.newStart);
              this.events.find(e => e.id == event.event.id).end = new Date(event.newEnd);
              this.events = [...this.events];
            });
          });
        }
        break;
      case CalendarEventTimesChangedEventType.Drop:

        break;
      case CalendarEventTimesChangedEventType.Resize:
        if (event.newStart.toString() !== event.event.start.toString() || event.newEnd.toString() !== event.event.end.toString()) {
          this.appointmentService.getById(+event.event.id).subscribe(appointment => {
            appointment.startTime = event.newStart;
            appointment.endTime = event.newEnd;
            this.appointmentService.update(appointment).subscribe(newAppointment => {
              this.events.find(e => e.id == event.event.id).start = new Date(event.newStart);
              this.events.find(e => e.id == event.event.id).end = new Date(event.newEnd);
              this.events = [...this.events];
            });
          });
        }
        break;
      default:
        break;
    }
  }

  onAddAppointment() {
    this.targetEvent = new CalendarEvent(undefined, undefined, undefined, undefined);
  }
}
