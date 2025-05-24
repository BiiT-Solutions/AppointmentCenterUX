import {Component, OnInit} from '@angular/core';
import {CalendarEvent, CalendarMode, castTo, EventColor} from "biit-ui/calendar";
import {
  Appointment,
  AppointmentService,
  AppointmentTemplate,
  AppointmentTemplateService,
  SessionService,
  ExternalAppointmentsService
} from "appointment-center-structure-lib";
import {CalendarEventConverter} from "../../shared/utils/calendar-event-converter.module";
import {BiitProgressBarType, BiitSnackbarService, NotificationType} from "biit-ui/info";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {CalendarEventTimesChangedEvent, CalendarEventTimesChangedEventType} from "angular-calendar";
import {User} from "authorization-services-lib";
import {UserService} from "user-manager-structure-lib";
import {combineLatest, defaultIfEmpty, EMPTY, Observable} from "rxjs";
import {PermissionService} from "../../services/permission.service";
import {Permission} from "../../config/rbac/permission";
import {WorkshopMode} from "./enums/workshop-mode";
import {addWeeks, startOfToday, subWeeks, subMilliseconds, startOfDay} from "date-fns";
import {ValidateDragParams} from "angular-draggable-droppable/lib/draggable.directive";
import {ErrorHandler} from "biit-ui/utils";

@Component({
  selector: 'appointment-calendar',
  templateUrl: './appointment-calendar.component.html',
  styleUrls: ['./appointment-calendar.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi: true,
      useValue: {scope: 'components/appointment_center', alias: 'app'}
    }
  ]
})
export class AppointmentCalendarComponent implements OnInit {

  protected readonly BiitProgressBarType = BiitProgressBarType;
  protected readonly addWeeks = addWeeks;
  protected readonly subWeeks = subWeeks;
  protected readonly startOfToday = startOfToday;
  protected readonly EventColor = EventColor;
  protected readonly window = window;

  protected viewDate: Date = new Date();
  protected events: CalendarEvent[] = [];
  protected workshops: AppointmentTemplate[] = [];
  protected filteredWorkshops: AppointmentTemplate[] = [];
  protected selectedWorkshops: Set<AppointmentTemplate> = new Set<AppointmentTemplate>();
  protected organizationUsers: User[] = [];
  protected waiting: boolean = false;
  protected search: string = "";
  protected currentSearch: string = "";
  protected mousePosition: MouseEvent;
  protected workshopModes = Object.keys(WorkshopMode);
  protected translatedWorkshopModes: { value: string, label: string }[] = [];
  protected workshopDragValidation = (params: ValidateDragParams) => {
    return this.permissionService.hasPermission(Permission.APPOINTMENT.CREATE)
  };

  protected cardEvent: CalendarEvent;
  protected cardWorkshop: AppointmentTemplate;
  protected cardWorkshopSubs: CalendarEvent[];
  protected targetEvent: CalendarEvent;
  protected targetEventTemplate: AppointmentTemplate;
  protected deleteEvent: CalendarEvent;
  protected targetWorkshop: AppointmentTemplate;
  protected deleteWorkshop: AppointmentTemplate;
  protected synchronizeCalendar: boolean = false;

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
              private translocoService: TranslocoService,
              private externalAppointmentsService: ExternalAppointmentsService) {
    this.loadWorkshops();
    this.loadSpeakers();
  }

  ngOnInit() {
    const workshopModeTranslations = this.workshopModes.map(workshopMode => this.translocoService.selectTranslate(`${workshopMode}`, {}, {
      scope: 'components/appointment_center',
      alias: 'app'
    }));
    combineLatest(workshopModeTranslations).subscribe((translations) => {
      translations.forEach((label, index) => this.translatedWorkshopModes.push({
        value: this.workshopModes[index],
        label: label
      }));
    });
  }

  protected loadEvents(): Promise<void> {
    if (!this.viewDate) {
      this.biitSnackbarService.showNotification(this.translocoService.translate('no_date_provided'), NotificationType.ERROR, null, 10);
      return Promise.reject(null);
    }
    const from: Date = startOfDay(this.viewDate);
    const to: Date = subMilliseconds(addWeeks(from ,1), 1);

    // Todo: An endpoint to get all appointment for a range of dates is required.

    return new Promise((resolve) => {
      const promise = combineLatest([
          this.appointmentService.getByAttendee(this.sessionService.getUser().uuid),
          this.selectedWorkshops.size ? this.appointmentService.getByTemplateIds([...this.selectedWorkshops].map(w => w.id)) : this.appointmentService.getAllByOrganization(sessionStorage.getItem('organization')),
          //this.externalAppointmentsService.getsAppointmentsFromExternalProvider()
        ]);


      this.waiting = true;
      promise.subscribe({
        next: ([appointments, selected]) => {
          const hash = new Map<number, Appointment>;

          if (selected) {
            if (!this.permissionService.hasPermission(Permission.APPOINTMENT_CENTER.ADMIN) &&
              !this.permissionService.hasPermission(Permission.APPOINTMENT_CENTER.MANAGER)) {
              (selected as Appointment[]).map(a => {
                if (!a.attendees.includes(this.sessionService.getUser().uuid)) {
                  if (a.colorTheme) {
                    a.colorTheme = "EMPTY_" + a.colorTheme;
                  } else {
                    a.colorTheme = "EMPTY_RED";
                  }
                }
              });
            }
            (selected as Appointment[]).map(a => hash.set(a.id, a));
          }

          //appointments.add(externalAppointments);
          appointments.forEach(a => hash.set(a.id, a));

          this.events = [...hash.values()].map(e => {
            const event = CalendarEventConverter.convertToCalendarEvent(e);
            event.cssClass = (!this.permissionService.hasPermission(Permission.APPOINTMENT_CENTER.ADMIN) &&
              !this.permissionService.hasPermission(Permission.APPOINTMENT_CENTER.MANAGER)) &&
            !event.meta.attendees.includes(this.sessionService.getUser().uuid) ? 'card-unsubscribed' : '';
            return event;
          });
        },
        error: error => ErrorHandler.notify(error, this.translocoService, this.biitSnackbarService)
      }).add(() => {
        this.waiting = false;
        resolve();
      });
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
      } else if (this.workshopMode == WorkshopMode.OTHER_WORKSHOPS) {
        call = this.templateService.getRestByAttendee(this.sessionService.getUser().uuid);
      } else {
        call = this.templateService.getAllByAttendee(this.sessionService.getUser().uuid);
      }
    }

    this.waiting = true;
    call.subscribe({
      next: (templates: AppointmentTemplate[]) => {
        this.workshops = templates;
        this.filteredWorkshops = templates;
        // All Workshops are selected by default
        this.workshops.forEach(w => this.selectedWorkshops.add(w));
        this.search = "";
      },
      error: error => ErrorHandler.notify(error, this.translocoService, this.biitSnackbarService)
    }).add(() => {
      //checking user's subscribed workshops
      let userCall: Observable<AppointmentTemplate[]>;
      if (!(this.permissionService.hasPermission(Permission.APPOINTMENT_CENTER.ADMIN) ||
        this.permissionService.hasPermission(Permission.APPOINTMENT_CENTER.MANAGER))) {
        userCall = this.templateService.getAllByAttendee(this.sessionService.getUser().uuid);
      } else {
        userCall = EMPTY.pipe(defaultIfEmpty(undefined));
      }
      userCall.subscribe({
        next: (templates: AppointmentTemplate[]) => {
          this.workshops.map(w => (w as any).subscribed = templates.map(t => t.id).includes(w.id));
          this.filteredWorkshops.map(w => (w as any).subscribed = templates.map(t => t.id).includes(w.id));
        },
        error: error => ErrorHandler.notify(error, this.translocoService, this.biitSnackbarService)
      }).add(() => {
        this.loadEvents();
      });
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
          if (event.newStart.toString() !== event.event.start.toString()) {
            this.translocoService.selectTranslate('action_denied_permissions').subscribe(msg => {
              this.biitSnackbarService.showNotification(msg, NotificationType.ERROR, null, 10);
            });
          }
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
      this.appointmentService.getById(+event.event.id).subscribe({
        next: appointment => {
          appointment.startTime = event.newStart;
          appointment.endTime = event.newEnd;
          this.appointmentService.update(appointment).subscribe(newAppointment => {
            this.events.find(e => e.id == event.event.id).start = new Date(event.newStart);
            this.events.find(e => e.id == event.event.id).end = new Date(event.newEnd);
            this.events = [...this.events];
          });
        },
        error: error => ErrorHandler.notify(error, this.translocoService, this.biitSnackbarService)
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
          this.translocoService.selectTranslate('delete_appointment_success', {}, {scope: 'components/appointment_center'}).subscribe(msg => {
            this.biitSnackbarService.showNotification(msg, NotificationType.SUCCESS, null, 5);
          });
          this.events = this.events.filter(e => e.id !== this.deleteEvent.id);
        },
        error: error => ErrorHandler.notify(error, this.translocoService, this.biitSnackbarService)
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
        this.biitSnackbarService.showNotification(this.translocoService.translate('app.success_subscribe'), NotificationType.SUCCESS, null, 5);
      },
      error: error => ErrorHandler.notify(error, this.translocoService, this.biitSnackbarService)
    }).add(() => {
      this.waiting = false;
    });
  }

  protected onUnsubscribeAppointment(appointmentId: number) {
    this.waiting = true;
    this.appointmentService.unsubscribeCurrentUser(appointmentId).subscribe({
      next: () => {
        this.loadEvents();
        this.biitSnackbarService.showNotification(this.translocoService.translate('app.success_unsubscribe'), NotificationType.SUCCESS, null, 5);
      },
      error: error => ErrorHandler.notify(error, this.translocoService, this.biitSnackbarService)
    }).add(() => {
      this.waiting = false;
    });
  }

  protected onAddWorkshop() {
    this.targetWorkshop = new AppointmentTemplate();
  }

  protected onUpdateWorkshop(workshop: AppointmentTemplate) {
    const prevIndex = this.workshops.findIndex(w => w.id == workshop.id);
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
        this.translocoService.selectTranslate('delete_workshop_success', {}, {scope: 'components/appointment_center'}).subscribe(msg => {
          this.biitSnackbarService.showNotification(msg, NotificationType.SUCCESS, null, 5);
        });
        this.workshops = this.workshops.filter(w => w.id !== this.deleteWorkshop.id);
        this.filterWorkshops();
      },
      error: error => ErrorHandler.notify(error, this.translocoService, this.biitSnackbarService)
    }).add(() => {
      this.deleteWorkshop = undefined;
    });
  }

  protected filterWorkshops() {
    this.currentSearch = this.search;
    this.filteredWorkshops = this.workshops;
    if (this.search.length) {
      this.filteredWorkshops = this.filteredWorkshops.filter(workshop => workshop.title.toLowerCase().includes(this.search.toLowerCase()));
    }
  }

  protected resetInputValue() {
    this.search = this.currentSearch;
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

  protected openWorkshopCard(workshop: AppointmentTemplate) {
    this.cardWorkshopSubs = this.events.filter(e => e.meta.attendees.includes(this.sessionService.getUser().uuid) && e.meta.appointmentTemplateId == workshop.id);
    this.cardWorkshop = workshop;
  }

  onWorkshopNextDate(date?: Date) {
    if (date) {
      this.viewDate = date;
    } else {
      if (this.permissionService.hasPermission(Permission.APPOINTMENT_CENTER.ADMIN) || this.permissionService.hasPermission(Permission.APPOINTMENT_CENTER.MANAGER) || this.selectedWorkshops.has(this.workshops.find(w => w.id == this.cardWorkshop.id))) {
        this.findNextDate();
      } else {
        this.selectedWorkshops.add(this.workshops.find(w => w.id == this.cardWorkshop.id));
        this.loadEvents().then(() => {
          this.findNextDate();
        });
      }
    }
    this.cardWorkshop = undefined;
    this.cardWorkshopSubs = undefined;
  }

  private findNextDate() {
    const nextEvent = this.events.find(e => e.meta.appointmentTemplateId == this.cardWorkshop.id && e.start.getTime() > Date.now())
    if (nextEvent) {
      this.viewDate = nextEvent.start;
    } else {
      this.biitSnackbarService.showNotification(this.translocoService.translate('app.err_no_next_date'), NotificationType.ERROR, null, 5);
    }
  }

  protected moveBackward(): void {
    this.viewDate = subWeeks(this.viewDate, 1)
    this.refreshEvents();
  }

  protected moveForward(): void {
    this.viewDate = addWeeks(this.viewDate, 1)
    this.refreshEvents();
  }

  protected moveToToday(): void {
    this.viewDate = startOfToday()
    this.refreshEvents();
  }

  private refreshEvents(): void {
    this.waiting = true;
    this.loadEvents().finally(() => this.waiting = false);
  }

  onSynchronize3rdParty() {
    this.synchronizeCalendar = !this.synchronizeCalendar;
  }

  refresh3rdPartyEvents(): void {
    //this.loadEvents();
  }
}
