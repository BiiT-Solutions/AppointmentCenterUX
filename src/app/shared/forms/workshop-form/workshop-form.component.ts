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
import {UserService} from "user-manager-structure-lib";
import {User} from "authorization-services-lib";
import {ColorTheme} from "../../enums/color-theme";
import {combineLatest} from "rxjs";

@Component({
  selector: 'workshop-form',
  templateUrl: './workshop-form.component.html',
  styleUrls: ['./workshop-form.component.scss'],
  providers: [provideTranslocoScope({scope: 'components/forms', alias: 'form'})]
})
export class WorkshopFormComponent implements OnInit {
  @Input() workshop: AppointmentTemplate;
  @Input() organizationUsers: User[];
  @Output() onSaved: EventEmitter<AppointmentTemplate> = new EventEmitter<AppointmentTemplate>();
  protected speakers: {value:string, label:string}[] = [];
  protected colors = Object.keys(ColorTheme);
  protected translatedColors: {value:string, label:string}[] = [];

  protected errors: Map<WorkshopFormValidationFields, string> = new Map<WorkshopFormValidationFields, string>();
  protected readonly WorkshopFormValidationFields = WorkshopFormValidationFields;

  protected readonly Type = Type;

  constructor(private appointmentTemplateService: AppointmentTemplateService,
              private userService: UserService,
              private snackbarService: BiitSnackbarService,
              private transloco: TranslocoService) {
  }

  ngOnInit() {
    const currentOrganization = sessionStorage.getItem('organization');

    if (!this.workshop.id) {
      this.workshop.organizationId = currentOrganization;
    }

    if (this.workshop.organizationId == currentOrganization) {
      this.speakers = this.organizationUsers.map(user => {return {value:user.uuid, label:`${user.name} ${user.lastname}`}});
    } else {
      this.userService.getOrganizationUsers(this.workshop.organizationId).subscribe({
        next: (users: User[]): void => {
          this.speakers = users.map(user => {return {value:user.uuid, label:`${user.name} ${user.lastname}`}});
        },
        error: () => {
          this.snackbarService.showNotification(this.transloco.translate('form.server_failed'), NotificationType.WARNING, null, 5);
        }
      })
    }

    const colorTranslations = this.colors.map(color=> this.transloco.selectTranslate(`${color}`,{}, {scope: 'components/forms', alias: 'form'}));
    combineLatest(colorTranslations).subscribe((translations)=> {
      translations.forEach((label, index) => this.translatedColors.push({value: this.colors[index], label: label}));
    });
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

  protected onMultiselectSelection(values: {value:string, label:string}[]): void {
    this.workshop.speakers = values.map(i => i.value);
  }
}
