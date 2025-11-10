import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {provideTranslocoScope, TranslocoService} from "@ngneat/transloco";
import {AppointmentTemplate, AppointmentTemplateService} from "@biit-solutions/appointment-center-structure";
import {BiitSnackbarService, NotificationType} from "@biit-solutions/wizardry-theme/info";
import {WorkshopFormValidationFields} from "../../validations/forms/workshop-form-validation-fields";
import {Type} from "@biit-solutions/wizardry-theme/inputs";
import {UserService} from "@biit-solutions/user-manager-structure";
import {User} from "@biit-solutions/authorization-services";
import {ColorTheme} from "../../enums/color-theme";
import {combineLatest} from "rxjs";
import {ErrorHandler} from "@biit-solutions/wizardry-theme/utils";

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
  protected speakers: { value: string, label: string }[] = [];
  protected colors = Object.keys(ColorTheme);
  protected translatedColors: { value: string, label: string }[] = [];

  protected errors: Map<WorkshopFormValidationFields, string> = new Map<WorkshopFormValidationFields, string>();
  protected readonly WorkshopFormValidationFields = WorkshopFormValidationFields;

  protected readonly Type = Type;

  protected saving: boolean = false;

  constructor(private appointmentTemplateService: AppointmentTemplateService,
              private userService: UserService,
              private snackbarService: BiitSnackbarService,
              private transloco: TranslocoService) {
  }

  ngOnInit() {
    const currentOrganization = sessionStorage.getItem('organization');

    if (!this.workshop.id) {
      this.workshop.organizationId = currentOrganization;
      this.workshop.colorTheme = ColorTheme.RED;
    }

    if (this.workshop.organizationId == currentOrganization) {
      this.speakers = this.organizationUsers.map(user => {
        return {value: user.uuid, label: `${user.name} ${user.lastname}`}
      });
    } else {
      this.userService.getOrganizationUsers(this.workshop.organizationId).subscribe({
        next: (users: User[]): void => {
          this.speakers = users.map(user => {
            return {value: user.uuid, label: `${user.name} ${user.lastname}`}
          });
        },
        error: error => ErrorHandler.notify(error, this.transloco, this.snackbarService)
      })
    }

    const colorTranslations = this.colors.map(color => this.transloco.selectTranslate(`${color}`, {}, {
      scope: 'components/forms',
      alias: 'form'
    }));
    combineLatest(colorTranslations).subscribe((translations) => {
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
        error: error => ErrorHandler.notify(error, this.transloco, this.snackbarService)
      })
    } else {
      this.saving = true;
      this.appointmentTemplateService.create(this.workshop).subscribe({
        next: (appointmentTemplate: AppointmentTemplate): void => {
          this.onSaved.emit(appointmentTemplate);
        },
        error: error => ErrorHandler.notify(error, this.transloco, this.snackbarService)
      }).add(() => this.saving = false);
    }
  }

  protected validate(): boolean {
    this.errors.clear();
    let verdict: boolean = true;
    if (!this.workshop.title) {
      verdict = false;
      this.errors.set(WorkshopFormValidationFields.TITLE_MANDATORY, this.transloco.translate(`form.${WorkshopFormValidationFields.TITLE_MANDATORY.toString()}`));
    }
    if (this.workshop.duration < 1) {
      verdict = false;
      this.errors.set(WorkshopFormValidationFields.DURATION_MANDATORY, this.transloco.translate(`form.${WorkshopFormValidationFields.DURATION_MANDATORY.toString()}`));
    }
    return verdict;
  }

  protected onMultiselectSelection(values: { value: string, label: string }[]): void {
    this.workshop.speakers = values.map(i => i.value);
  }
}
