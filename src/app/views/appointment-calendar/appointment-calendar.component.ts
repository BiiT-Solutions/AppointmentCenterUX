import {Component} from '@angular/core';
import {CalendarEvent, CalendarMode, castTo} from "biit-ui/calendar";
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
import {combineLatest} from "rxjs";

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
  protected speakers: User[] = [];
  protected readonly CalendarMode = CalendarMode;
  protected waiting: boolean = false;
  protected search: string = "";
  protected mousePosition: MouseEvent;

  protected cardEvent: CalendarEvent;
  protected targetEvent: CalendarEvent;
  protected targetEventTemplate: AppointmentTemplate;
  protected deleteEvent: CalendarEvent;
  protected targetWorkshop: AppointmentTemplate;
  protected deleteWorkshop: AppointmentTemplate;

  $mouseEvent = castTo<MouseEvent>();

  constructor(private appointmentService: AppointmentService,
              private userService: UserService,
              private templateService: AppointmentTemplateService,
              private biitSnackbarService: BiitSnackbarService,
              private translocoService: TranslocoService) {
    this.initLoad();
  }

  protected initLoad() {
    combineLatest([
      this.appointmentService.getAll(),
      this.templateService.getAll()
    ]).subscribe({
      next: ([appointments, templates]) => {
        this.events = appointments.map(CalendarEventConversor.convertToCalendarEvent);
        this.workshops = templates;
        this.filteredWorkshops = templates;
      }, error: (response: any) => {
        this.notifyLoadError(response);
      }
    }).add(() => {
      this.loadSpeakers();
      this.waiting = false;
    });
  }

  protected loadEvents(): void {
    this.waiting = true;
    this.appointmentService.getAll().subscribe({
      next: (appointments: Appointment[]) => {
        this.events = appointments.map(CalendarEventConversor.convertToCalendarEvent);
      },
      error: (response: any) => {
        this.notifyLoadError(response);
      }
    }).add(() => {
      this.waiting = false;
    });
  }

  private loadSpeakers() {
    const eventSpeakers = this.events.map(e => e.meta.speakers).flat();
    const workshopSpeakers = this.workshops.map(w => w.speakers).flat();
    const allSpeakers = Array.from(new Set(eventSpeakers.concat(workshopSpeakers)));
    this.userService.getByIds(allSpeakers).subscribe(users => this.speakers = users);
  }

  private notifyLoadError(response: any) {
    const error: string = response.status.toString();
    // Transloco does not load translation files. We need to load it manually;
    this.translocoService.selectTranslate(error, {}, {scope: 'components/appointment_center'}).subscribe(msg => {
      this.biitSnackbarService.showNotification(msg, NotificationType.ERROR, null, 5);
    });
  }

  protected onEventChange(event: CalendarEventTimesChangedEvent) {
    switch (event.type) {
      case CalendarEventTimesChangedEventType.Drag:
        if (event.newStart.toString() !== event.event.start.toString()) {
          this.onUpdateAppointment(event);
        }
        break;
      case CalendarEventTimesChangedEventType.Drop:
        this.targetEventTemplate = (event.event as any) as AppointmentTemplate;
        this.onAddAppointment(event.newStart);
        break;
      case CalendarEventTimesChangedEventType.Resize:
        if (event.newStart.toString() !== event.event.start.toString() || event.newEnd.toString() !== event.event.end.toString()) {
          this.onUpdateAppointment(event);
        }
        break;
      default:
        break;
    }
  }

  protected onAddAppointment(startDate?: Date) {
    this.targetEvent = new CalendarEvent(undefined, undefined, startDate, undefined);
  }

  private onUpdateAppointment(event: CalendarEventTimesChangedEvent<any>) {
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

  protected onDeleteAppointment() {
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

  protected onAddWorkshop() {
    this.targetWorkshop = new AppointmentTemplate();
  }

  protected onUpdateWorkshop(workshop: AppointmentTemplate) {
    const prevIndex = this.workshops.findIndex(w=> w.id == workshop.id);
    if (prevIndex >= 0) {
      this.workshops[prevIndex] = workshop;
    } else {
      this.workshops.push(workshop);
    }
    this.filterWorkshops();
  }

  protected onDeleteWorkshop() {
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

  protected filterWorkshops() {
    this.filteredWorkshops = this.workshops.map(workshop => AppointmentTemplate.clone(workshop));
    if (this.search.length) {
      this.filteredWorkshops = this.filteredWorkshops.filter(workshop => workshop.title.toLowerCase().includes(this.search.toLowerCase()));
    }
  }

  protected resetInputValue(event: Event, value: string) {
    (event.target as HTMLInputElement).value = value;
  }

  log(event: any) {
    console.log("DEVELOPMENT LOG: ", event);
  }
}
