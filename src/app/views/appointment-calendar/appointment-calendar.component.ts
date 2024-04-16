import {Component} from '@angular/core';
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
import {User} from "authorization-services-lib";
import {UserService} from "user-manager-structure-lib";

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
  protected filteredWorkshops: AppointmentTemplate[] = [];
  protected workshopSpeakers: User[] = [];
  protected readonly CalendarMode = CalendarMode;
  protected waiting: boolean = false;
  protected search: string = "";

  protected targetEvent: CalendarEvent;
  protected targetEventTemplate: AppointmentTemplate;
  protected deleteEvent: CalendarEvent;
  protected targetWorkshop: AppointmentTemplate;
  protected deleteWorkshop: AppointmentTemplate;

  constructor(private appointmentService: AppointmentService,
              private userService: UserService,
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
        this.filteredWorkshops = templates;
        const speakers = Array.from(new Set(templates.map(w => w.speakers).flat()));
        this.userService.getByIds(speakers).subscribe(users => this.workshopSpeakers = users);
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
        this.targetEventTemplate = (event.event as any) as AppointmentTemplate;
        this.onAddAppointment(event.newStart);
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

  onAddAppointment(startDate?: Date) {
    this.targetEvent = new CalendarEvent(undefined, undefined, startDate, undefined);
  }

  onDeleteAppointment() {
    this.appointmentService.deleteById(+this.deleteEvent.id).subscribe({
      next: () => {
        // Transloco does not load translation files. We need to load it manually;
        this.translocoService.selectTranslate('delete_appointment_success', {},  {scope: 'components/appointment_center'}).subscribe(msg => {
          this.biitSnackbarService.showNotification(msg, NotificationType.SUCCESS, null, 5);
        });
        this.events = this.events.filter(e => e.id !== this.deleteEvent.id);
        this.deleteEvent = undefined;
      }, error: (response: any) => {
        const error: string = response.status.toString();
        // Transloco does not load translation files. We need to load it manually;
        this.translocoService.selectTranslate(error, {},  {scope: 'components/appointment_center'}).subscribe(msg => {
          this.biitSnackbarService.showNotification(msg, NotificationType.ERROR, null, 5);
        });
        this.deleteEvent = undefined;
      }
    }).add(() => {
      this.deleteEvent = undefined;
    });
  }

  onAddWorkshop() {
    this.targetWorkshop = new AppointmentTemplate();
  }

  onDeleteWorkshop() {
    this.templateService.deleteById(+this.deleteWorkshop.id).subscribe({
      next: () => {
        // Transloco does not load translation files. We need to load it manually;
        this.translocoService.selectTranslate('delete_workshop_success', {},  {scope: 'components/appointment_center'}).subscribe(msg => {
          this.biitSnackbarService.showNotification(msg, NotificationType.SUCCESS, null, 5);
        });
        this.workshops = this.workshops.filter(w => w.id !== this.deleteWorkshop.id);
        this.filterWorkshops();
      }, error: (response: any) => {
        const error: string = response.status.toString();
        // Transloco does not load translation files. We need to load it manually;
        this.translocoService.selectTranslate(error, {},  {scope: 'components/appointment_center'}).subscribe(msg => {
          this.biitSnackbarService.showNotification(msg, NotificationType.ERROR, null, 5);
        });
      }
    }).add(() => {
      this.deleteWorkshop = undefined;
    });
  }

  filterWorkshops() {
    this.filteredWorkshops = this.workshops.map(workshop => AppointmentTemplate.clone(workshop));
    if (this.search.length) {
      this.filteredWorkshops = this.filteredWorkshops.filter(workshop => workshop.title.toLowerCase().includes(this.search.toLowerCase()));
    }
  }

  resetInputValue(event: Event, value: string) {
    (event.target as HTMLInputElement).value = value;
  }
}
