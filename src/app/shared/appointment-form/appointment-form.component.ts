import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {CalendarEvent} from "biit-ui/calendar";
import {Appointment, AppointmentService, Status} from "appointment-center-structure-lib";
import {Type} from "biit-ui/inputs";
import {parseISO, format} from "date-fns"
import {CalendarEventConversor} from "../../utils/calendar-event-conversor";
import {HttpErrorResponse, HttpStatusCode} from "@angular/common/http";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {ApplicationFormValidationFields} from "../validations/forms/application-form-validation-fields";

@Component({
  selector: 'appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/appointment_form', alias: 'form'}
    }
  ]
})
export class AppointmentFormComponent implements OnInit {
  @Input() event: CalendarEvent;
  @Output() onSaved: EventEmitter<CalendarEvent> = new EventEmitter<CalendarEvent>();
  protected appointment: Appointment = new Appointment();
  protected errors: Map<ApplicationFormValidationFields, string> = new Map<ApplicationFormValidationFields, string>();
  protected status = Object.keys(Status);
  protected readonly Type = Type;
  protected readonly ApplicationFormValidationFields = ApplicationFormValidationFields;

  constructor(private appointmentService: AppointmentService,
              private snackbarService: BiitSnackbarService,
              private transloco: TranslocoService) {
  }

  ngOnInit() {
    if (this.event.id) {
      this.appointmentService.getById(+this.event.id)
        .subscribe(appointment => this.appointment = appointment);
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
      this.errors.set(ApplicationFormValidationFields.TITLE_MANDATORY, this.transloco.translate(`form.${ApplicationFormValidationFields.TITLE_MANDATORY.toString()}`));
    }
    if (!this.appointment.startTime) {
      verdict = false;
      this.errors.set(ApplicationFormValidationFields.START_DATE_MANDATORY, this.transloco.translate(`form.${ApplicationFormValidationFields.START_DATE_MANDATORY.toString()}`));
    }
    if (!this.appointment.endTime) {
      verdict = false;
      this.errors.set(ApplicationFormValidationFields.END_DATE_MANDATORY, this.transloco.translate(`form.${ApplicationFormValidationFields.END_DATE_MANDATORY.toString()}`));
    }
    return verdict;
  }
}
