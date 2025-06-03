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

  googleCredentialsExists: boolean = false;
  msCredentialsExists: boolean = false;

  constructor(private ref: ElementRef, private googleSigninService: GoogleSigninService,
              private googleCredentialsService: GoogleCredentialsService,
              private externalCredentialsService: ExternalCredentialsService,
              private snackbarService: BiitSnackbarService,
              private transloco: TranslocoService) {
  }


  async ngOnInit(): Promise<void> {
    this.msCredentialsExists = await this.checkCredentials(CalendarProvider.MICROSOFT);
    this.googleCredentialsExists = await this.checkCredentials(CalendarProvider.GOOGLE);
    this.initializeGoogleClient();
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

  initializeGoogleClient(): void {
    this.googleSigninService.initializeOauthClient(Environment.GOOGLE_API_STATE, Environment.GOOGLE_API_CLIENT_ID,
      (code: string, state: string) => {
        if (state === Environment.GOOGLE_API_STATE) {
          this.snackbarService.showNotification(this.transloco.translate('form.calendar-permissions-retrieved-success'), NotificationType.INFO, null, 5);
          this.googleCredentialsService.exchangeGoogleAuthCodeByTokenByParams(code, state).subscribe();
          this.googleCredentialsExists = true;
        } else {
          console.error("Invalid state");
          this.snackbarService.showNotification(this.transloco.translate('form.calendar-permissions-failed'), NotificationType.ERROR, null, 5);
        }
      });
  }


  disconnectFromGoogle() {
    this.externalCredentialsService.removeToken(this.googleProvider).subscribe();
    this.googleCredentialsExists = false;
  }

  protected triggerMsOauthRequest(): void {
    this.openMsPopup().then(() => {
      console.log("Popup closed");
      this.checkCredentials(CalendarProvider.MICROSOFT).then(value => {
        this.msCredentialsExists = value;
        if (value) {
          this.snackbarService.showNotification(this.transloco.translate('form.calendar-permissions-retrieved-success'), NotificationType.INFO, null, 5);
        } else {
          this.snackbarService.showNotification(this.transloco.translate('form.calendar-permissions-failed'), NotificationType.ERROR, null, 5)
        }
      }).catch(reason => {
        console.error("Error checking credentials", reason);
        this.snackbarService.showNotification(this.transloco.translate('form.calendar-permissions-failed'), NotificationType.ERROR, null, 5);
        this.msCredentialsExists = false;
      })
    });
  }

  protected disconnectFromMS(): void {
    this.externalCredentialsService.removeToken(CalendarProvider.MICROSOFT).subscribe({
      next: () => {
        this.snackbarService.showNotification(this.transloco.translate('form.calendar-permissions-removed'), NotificationType.INFO, null, 5);
        this.msCredentialsExists = false;
      },
      error: (error) => {
        console.error("Error removing MS credentials", error);
        this.snackbarService.showNotification(this.transloco.translate('form.calendar-permissions-failed'), NotificationType.ERROR, null, 5);
      }
    })
  }

  private async openMsPopup(): Promise<void> {
    return new Promise<void>((resolve) => {
      let root = '';
      if (Environment.CONTEXT) {
        root = '/';
      }
      const popup = window.open(`${root}${Environment.CONTEXT}/microsoft`, "Microsoft OAuth", "width=500,height=700,menubar=no,toolbar=no,location=no,status=no,resizable=no,scrollbars=no");
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

