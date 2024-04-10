import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {provideTranslocoScope, TranslocoService} from "@ngneat/transloco";
import {CalendarEvent} from "biit-ui/calendar";
import {Appointment, AppointmentService, AppointmentTemplate, Status} from "appointment-center-structure-lib";
import {Type} from "biit-ui/inputs";
import {addMinutes} from "date-fns"
import {CalendarEventConversor} from "../../../utils/calendar-event-conversor";
import {HttpErrorResponse} from "@angular/common/http";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {AppointmentFormValidationFields} from "../../validations/forms/appointment-form-validation-fields";

@Component({
  selector: 'appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss'],
  providers: [provideTranslocoScope({scope: 'components/forms', alias: 'form'})]
})
export class AppointmentFormComponent implements OnInit {
  @Input() event: CalendarEvent;
  @Input() template: AppointmentTemplate;
  @Output() onSaved: EventEmitter<CalendarEvent> = new EventEmitter<CalendarEvent>();
  protected appointment: Appointment = new Appointment();
  protected errors: Map<AppointmentFormValidationFields, string> = new Map<AppointmentFormValidationFields, string>();
  protected status = Object.keys(Status);
  protected readonly Type = Type;
  protected readonly AppointmentFormValidationFields = AppointmentFormValidationFields;

  constructor(private appointmentService: AppointmentService,
              private snackbarService: BiitSnackbarService,
              private transloco: TranslocoService) {
  }

  ngOnInit() {
    if (this.event.id) {
      this.appointmentService.getById(+this.event.id)
        .subscribe(appointment => this.appointment = appointment);
    } else if (this.template) {
      this.appointment.title = this.template.title;
      this.appointment.description = this.template.description;
      this.appointment.startTime = this.event.start;
      if (this.template.duration) {
        this.appointment.endTime = addMinutes(this.appointment.startTime, this.template.duration);
      }
      this.appointment.organizationId = this.template.organizationId;
      this.appointment.examinationType = this.template.examinationType;
      this.appointment.speakers = this.template.speakers;
      this.appointment.cost = this.template.cost;
    }
  }

  onSave() {
    if (!this.validate()) {
      this.snackbarService.showNotification(this.transloco.translate('form.validation_failed'), NotificationType.WARNING, null, 5);
      return;
    }

    if (this.event.id) {
      this.appointmentService.update(this.appointment).subscribe({
        next: (appointment: Appointment): void => {
          this.onSaved.emit(CalendarEventConversor.convertToCalendarEvent(appointment));
        },
        error: (error: HttpErrorResponse): void => {
          this.snackbarService.showNotification(this.transloco.translate('form.server_failed'), NotificationType.WARNING, null, 5);
        }
      })
    } else {
      this.appointmentService.create(this.appointment).subscribe({
        next: (appointment: Appointment): void => {
          this.onSaved.emit(CalendarEventConversor.convertToCalendarEvent(appointment));
        },
        error: (error: HttpErrorResponse): void => {
          this.snackbarService.showNotification(this.transloco.translate('form.server_failed'), NotificationType.WARNING, null, 5);
        }
      })
    }
  }

  protected validate(): boolean {
    this.errors.clear();
    let verdict: boolean = true;
    if (!this.appointment.title) {
      verdict = false;
      this.errors.set(AppointmentFormValidationFields.TITLE_MANDATORY, this.transloco.translate(`form.${AppointmentFormValidationFields.TITLE_MANDATORY.toString()}`));
    }
    if (!this.appointment.startTime) {
      verdict = false;
      this.errors.set(AppointmentFormValidationFields.START_DATE_MANDATORY, this.transloco.translate(`form.${AppointmentFormValidationFields.START_DATE_MANDATORY.toString()}`));
    }
    if (!this.appointment.endTime) {
      verdict = false;
      this.errors.set(AppointmentFormValidationFields.END_DATE_MANDATORY, this.transloco.translate(`form.${AppointmentFormValidationFields.END_DATE_MANDATORY.toString()}`));
    }
    return verdict;
  }
}
