import {Component} from '@angular/core';
import {CalendarEvent, CalendarMode, castTo, EventColor} from "biit-ui/calendar";
import {
  Appointment,
  AppointmentService,
  AppointmentTemplate,
  AppointmentTemplateService,
  SessionService
} from "appointment-center-structure-lib";
import {CalendarEventConversor} from "../../utils/calendar-event-conversor";
import {BiitProgressBarType, BiitSnackbarService, NotificationType} from "biit-ui/info";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {CalendarEventTimesChangedEvent, CalendarEventTimesChangedEventType} from "angular-calendar";
import {User} from "authorization-services-lib";
import {UserService} from "user-manager-structure-lib";
import {Observable} from "rxjs";
import {PermissionService} from "../../services/permission.service";
import {Permission} from "../../config/rbac/permission";
import {WorkshopMode} from "./enums/workshop-mode";

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
  protected selectedWorkshops: Set<AppointmentTemplate> = new Set<AppointmentTemplate>();
  protected organizationUsers: User[] = [];
  protected waiting: boolean = false;
  protected search: string = "";
  protected mousePosition: MouseEvent;

  protected cardEvent: CalendarEvent;
  protected targetEvent: CalendarEvent;
  protected targetEventTemplate: AppointmentTemplate;
  protected deleteEvent: CalendarEvent;
  protected targetWorkshop: AppointmentTemplate;
  protected deleteWorkshop: AppointmentTemplate;

  protected workshopMode: WorkshopMode = WorkshopMode.ALL_WORKSHOPS;
  protected readonly CalendarMode = CalendarMode;
  protected readonly WorkshopMode = WorkshopMode;
  protected readonly Permission = Permission;

  $mouseEvent = castTo<MouseEvent>();

  constructor(private appointmentService: AppointmentService,
              private userService: UserService,
              private templateService: AppointmentTemplateService,
              protected sessionService: SessionService,
              protected permissionService: PermissionService,
              private biitSnackbarService: BiitSnackbarService,
              private translocoService: TranslocoService) {
    this.loadEvents();
    this.loadWorkshops();
    this.loadSpeakers();
  }

  protected loadEvents(): void {
    let promise;

    if (this.permissionService.hasPermission(Permission.APPOINTMENT_CENTER.ADMIN)) {
      promise = this.selectedWorkshops.size ?
        this.appointmentService.getByTemplateIds([...this.selectedWorkshops].map(w => w.id))
        : this.appointmentService.getAll();
    } else if (this.permissionService.hasPermission(Permission.APPOINTMENT_CENTER.MANAGER)) {
      promise = this.selectedWorkshops.size ?
        this.appointmentService.getByTemplateIds([...this.selectedWorkshops].map(w => w.id))
        : this.appointmentService.getAll();
    } else {
      promise = this.selectedWorkshops.size ?
        this.appointmentService.getByTemplateIds([...this.selectedWorkshops].map(w => w.id))
        : this.appointmentService.getByAttendee(this.sessionService.getUser().uuid);
    }

    this.waiting = true;
    promise.subscribe({
      next: (appointments: Appointment[]) => {
        if (!this.permissionService.hasPermission(Permission.APPOINTMENT_CENTER.ADMIN) &&
            !this.permissionService.hasPermission(Permission.APPOINTMENT_CENTER.MANAGER)) {
          appointments.map(a => {
            if (!a.attendees.includes(this.sessionService.getUser().uuid)) {
              if (a.colorTheme) {
                a.colorTheme = "EMPTY_" + a.colorTheme;
              } else {
                a.colorTheme = "EMPTY_RED";
              }
            }
          });
        }
        this.events = appointments.map(e => {
          const event = CalendarEventConversor.convertToCalendarEvent(e);
          event.cssClass = (!this.permissionService.hasPermission(Permission.APPOINTMENT_CENTER.ADMIN) &&
            !this.permissionService.hasPermission(Permission.APPOINTMENT_CENTER.MANAGER)) &&
            !event.meta.attendees.includes(this.sessionService.getUser().uuid) ? 'card-unsubscribed' : '';
          return event;
        });
      },
      error: (response: any) => {
        this.notifyLoadError(response);
      }
    }).add(() => {
      this.waiting = false;
    });
  }

  private loadSpeakers() {
    this.userService.getByUserGroupName('speakers').subscribe(users => this.organizationUsers = users);
  }

  protected loadWorkshops() {
    let call: Observable<AppointmentTemplate[]>;

    if (this.permissionService.hasPermission(Permission.APPOINTMENT_CENTER.ADMIN) ||
        this.permissionService.hasPermission(Permission.APPOINTMENT_CENTER.MANAGER)) {
      call = this.templateService.getAll();
    } else {
      if (this.workshopMode == WorkshopMode.ALL_WORKSHOPS) {
        call = this.templateService.getAllViewer();
      } else {
        call = this.templateService.getAllByAttendee(this.sessionService.getUser().uuid);
      }
    }

    this.waiting = true;
    call.subscribe({
      next: (templates: AppointmentTemplate[]) => {
        this.workshops = templates;
        this.filteredWorkshops = templates;
        this.search = "";
      }, error: (response: any) => {
        this.notifyLoadError(response);
      }
    }).add(() => {
      this.waiting = false;
    });
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
        if (this.permissionService.hasPermission(Permission.APPOINTMENT.EDIT) &&
            this.permissionService.hasPermission(Permission.CALENDAR.DRAG)) {
          if (event.newStart.toString() !== event.event.start.toString()) {
            this.onUpdateAppointment(event);
          }
        } else {
          this.translocoService.selectTranslate('action_denied_permissions').subscribe(msg => {
            this.biitSnackbarService.showNotification(msg, NotificationType.ERROR, null, 10);
          });
        }
        break;
      case CalendarEventTimesChangedEventType.Drop:
        if (this.permissionService.hasPermission(Permission.APPOINTMENT.CREATE) &&
            this.permissionService.hasPermission(Permission.CALENDAR.DROP)) {
          this.targetEventTemplate = (event.event as any) as AppointmentTemplate;
          this.onAddAppointment(event.newStart);
        } else {
          this.translocoService.selectTranslate('action_denied_permissions').subscribe(msg => {
            this.biitSnackbarService.showNotification(msg, NotificationType.ERROR, null, 10);
          });
        }
        break;
      case CalendarEventTimesChangedEventType.Resize:
        if (this.permissionService.hasPermission(Permission.APPOINTMENT.EDIT) &&
            this.permissionService.hasPermission(Permission.CALENDAR.RESIZE)) {
          if (event.newStart.toString() !== event.event.start.toString() || event.newEnd.toString() !== event.event.end.toString()) {
            this.onUpdateAppointment(event);
          }
        } else {
          this.translocoService.selectTranslate('action_denied_permissions').subscribe(msg => {
            this.biitSnackbarService.showNotification(msg, NotificationType.ERROR, null, 10);
          });
        }
        break;
      default:
        break;
    }
  }

  protected onAddAppointment(startDate?: Date) {
    if (this.permissionService.hasPermission(Permission.APPOINTMENT.CREATE)) {
      this.targetEvent = new CalendarEvent(undefined, undefined, startDate, undefined);
    } else {
      this.translocoService.selectTranslate('action_denied_permissions').subscribe(msg => {
        this.biitSnackbarService.showNotification(msg, NotificationType.ERROR, null, 10);
      });
    }
  }

  private onUpdateAppointment(event: CalendarEventTimesChangedEvent<any>) {
    if (this.permissionService.hasPermission(Permission.APPOINTMENT.EDIT)) {
      this.appointmentService.getById(+event.event.id).subscribe(appointment => {
        appointment.startTime = event.newStart;
        appointment.endTime = event.newEnd;
        this.appointmentService.update(appointment).subscribe(newAppointment => {
          this.events.find(e => e.id == event.event.id).start = new Date(event.newStart);
          this.events.find(e => e.id == event.event.id).end = new Date(event.newEnd);
          this.events = [...this.events];
        });
      });
    } else {
      this.translocoService.selectTranslate('action_denied_permissions').subscribe(msg => {
        this.biitSnackbarService.showNotification(msg, NotificationType.ERROR, null, 10);
      });
    }
  }

  protected onDeleteAppointment() {
    if (this.permissionService.hasPermission(Permission.APPOINTMENT.DELETE)) {
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
    } else {
      this.translocoService.selectTranslate('action_denied_permissions').subscribe(msg => {
        this.biitSnackbarService.showNotification(msg, NotificationType.ERROR, null, 10);
      });
    }
  }

  protected onSubscribeAppointment(appointmentId: number) {
    this.waiting = true;
    this.appointmentService.subscribeCurrentUser(appointmentId).subscribe({
      next: () => {
        this.loadEvents();
      }, error: (response: any) => {
        this.notifyLoadError(response);
      }
    }).add(() => {
      this.waiting = false;
    });
  }

  protected onUnsubscribeAppointment(appointmentId: number) {
    this.waiting = true;
    this.appointmentService.unsubscribeCurrentUser(appointmentId).subscribe({
      next: () => {
        this.loadEvents();
      }, error: (response: any) => {
        this.notifyLoadError(response);
      }
    }).add(() => {
      this.waiting = false;
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

  protected workshopSelectionHandler(workshop: AppointmentTemplate) {
    if (!this.selectedWorkshops.has(workshop)) {
      this.selectedWorkshops.add(workshop);
    } else {
      this.selectedWorkshops.delete(workshop);
    }

    this.loadEvents();
  }

  eventStyles(color: EventColor): Record<string, string> {
    return {
      '--event-primary': color.primary,
      '--event-secondary': color.secondary,
      '--event-hover': color.hover,
      '--event-tertiary': color.tertiary
    }
  }

  log(event: any) {
    console.log("DEVELOPMENT LOG: ", event);
  }

  protected readonly BiitProgressBarType = BiitProgressBarType;
  protected readonly sessionStorage = sessionStorage;
}
