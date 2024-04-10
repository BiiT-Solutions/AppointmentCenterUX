import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {provideTranslocoScope, TranslocoService} from "@ngneat/transloco";
import {
  AppointmentTemplate,
  AppointmentTemplateService
} from "appointment-center-structure-lib";
import {HttpErrorResponse} from "@angular/common/http";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {AppointmentFormValidationFields} from "../../validations/forms/appointment-form-validation-fields";
import {WorkshopFormValidationFields} from "../../validations/forms/workshop-form-validation-fields";
import {Type} from "biit-ui/inputs";

@Component({
  selector: 'workshop-form',
  templateUrl: './workshop-form.component.html',
  styleUrls: ['./workshop-form.component.scss'],
  providers: [provideTranslocoScope({scope: 'components/forms', alias: 'form'})]
})
export class WorkshopFormComponent implements OnInit {
  @Input() workshop: AppointmentTemplate;
  @Output() onSaved: EventEmitter<AppointmentTemplate> = new EventEmitter<AppointmentTemplate>();
  protected errors: Map<WorkshopFormValidationFields, string> = new Map<WorkshopFormValidationFields, string>();
  protected readonly WorkshopFormValidationFields = WorkshopFormValidationFields;

  constructor(private appointmentTemplateService: AppointmentTemplateService,
              private snackbarService: BiitSnackbarService,
              private transloco: TranslocoService) {
  }

  ngOnInit() {

  }

  onSave() {
    if (!this.validate()) {
      this.snackbarService.showNotification(this.transloco.translate('form.validation_failed'), NotificationType.WARNING, null, 5);
      return;
    }

    if (this.workshop.id) {
      this.appointmentTemplateService.update(this.workshop).subscribe({
        next: (appointmentTemplate: AppointmentTemplate): void => {
          this.onSaved.emit(appointmentTemplate);
        },
        error: (error: HttpErrorResponse): void => {
          this.snackbarService.showNotification(this.transloco.translate('form.server_failed'), NotificationType.WARNING, null, 5);
        }
      })
    } else {
      this.appointmentTemplateService.create(this.workshop).subscribe({
        next: (appointmentTemplate: AppointmentTemplate): void => {
          this.onSaved.emit(appointmentTemplate);
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
    if (!this.workshop.title) {
      verdict = false;
      this.errors.set(WorkshopFormValidationFields.TITLE_MANDATORY, this.transloco.translate(`form.${AppointmentFormValidationFields.TITLE_MANDATORY.toString()}`));
    }
    return verdict;
  }

  protected readonly Type = Type;
}
