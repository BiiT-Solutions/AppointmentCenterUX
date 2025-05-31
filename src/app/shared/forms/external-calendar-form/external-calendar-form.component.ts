import {Component, ElementRef, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import {provideTranslocoScope, TranslocoService} from "@ngneat/transloco";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {Environment} from "../../../../environments/environment";
import {
  CalendarProvider,
  ExternalCredentialsService,
  GoogleCredentialsService,
  GoogleSigninService
} from "appointment-center-structure-lib";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'external-calendar-form',
  templateUrl: './external-calendar-form.component.html',
  styleUrls: ['./external-calendar-form.component.scss'],
  providers: [provideTranslocoScope({scope: 'components/external-calendar', alias: 'form'})]
})
export class ExternalCalendarFormComponent implements OnInit {

  readonly googleProvider: string = "GOOGLE";

  @Output() onClosed: EventEmitter<void> = new EventEmitter<void>();

  credentialsExists: boolean = undefined;
  msCredentialsExists: boolean = false;

  constructor(private ref: ElementRef, private googleSigninService: GoogleSigninService,
              private googleCredentialsService: GoogleCredentialsService,
              private externalCredentialsService: ExternalCredentialsService,
              private snackbarService: BiitSnackbarService,
              private transloco: TranslocoService) {
  }


  async ngOnInit(): Promise<void> {
    this.msCredentialsExists = await this.checkCredentials(CalendarProvider.MICROSOFT);
    this.googleSigninService.initializeOauthClient(Environment.GOOGLE_API_STATE, Environment.GOOGLE_API_CLIENT_ID,
      (code: string, state: string) => {
        if (state === Environment.GOOGLE_API_STATE) {
          this.snackbarService.showNotification(this.transloco.translate('form.calendarPermissionsRetrievedSuccess'), NotificationType.INFO, null, 5);
          this.googleCredentialsService.exchangeGoogleAuthCodeByTokenByParams(code, state).subscribe();
          this.credentialsExists = true;
        } else {
          console.error("Invalid state");
          this.snackbarService.showNotification(this.transloco.translate('form.calendarPermissionsFailed'), NotificationType.ERROR, null, 5);
        }
      });
    this.externalCredentialsService.checkIfCurrentUserHasCredentials(this.googleProvider).subscribe((_value: boolean): any => this.credentialsExists = _value);
  }


  @HostListener('document:window', ['$event'])
  clickout(event: MouseEvent | PointerEvent) {
    if (!this.ref.nativeElement.contains(event.target)) {
      this.onClosed.emit();
    }
  }


  triggerGoogleOathRequest(): void {
    this.googleSigninService.requestGoogleAuthCode();
  }


  disconnectFromGoogle() {
    this.externalCredentialsService.removeToken(this.googleProvider).subscribe();
    this.credentialsExists = false;
  }

  protected triggerMsOauthRequest(): void {
    this.openMsPopup().then(() => {
      console.log("Popup closed");
      this.checkCredentials(CalendarProvider.MICROSOFT).then(value => {
        this.msCredentialsExists = value;
        if (value) {
          this.snackbarService.showNotification(this.transloco.translate('form.calendarPermissionsRetrievedSuccess'), NotificationType.INFO, null, 5);
        } else {
          this.snackbarService.showNotification(this.transloco.translate('form.calendarPermissionsFailed'), NotificationType.ERROR, null, 5)
        }
      }).catch(reason => {
        console.error("Error checking credentials", reason);
        this.snackbarService.showNotification(this.transloco.translate('form.calendarPermissionsFailed'), NotificationType.ERROR, null, 5);
        this.msCredentialsExists = false;
      })
    });
  }

  protected disconnectFromMS(): void {
    this.externalCredentialsService.removeToken(CalendarProvider.MICROSOFT).subscribe({
      next: () => {
        this.snackbarService.showNotification(this.transloco.translate('form.calendarPermissionsRemoved'), NotificationType.INFO, null, 5);
        this.msCredentialsExists = false;
      },
      error: (error) => {
        console.error("Error removing MS credentials", error);
        this.snackbarService.showNotification(this.transloco.translate('form.calendarPermissionsFailed'), NotificationType.ERROR, null, 5);
      }
    })
  }

  private async openMsPopup(): Promise<void> {
    return new Promise<void>((resolve) => {
      const popup = window.open("./../microsoft", "Microsoft OAuth", "width=500,height=700,menubar=no,toolbar=no,location=no,status=no,resizable=no,scrollbars=no");
      const timer = setInterval(() => {
        if (!popup || popup.closed) {
          clearInterval(timer);
          resolve();
        }
      }, 500);
    });
  }

  private async checkCredentials(provider: CalendarProvider): Promise<boolean> {
    return firstValueFrom(this.externalCredentialsService.checkIfCurrentUserHasCredentials(provider));
  }

}

