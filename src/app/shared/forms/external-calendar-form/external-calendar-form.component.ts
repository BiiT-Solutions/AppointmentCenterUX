import {Component, ElementRef, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import {provideTranslocoScope, TranslocoService} from "@ngneat/transloco";
import {BiitProgressBarType, BiitSnackbarService, NotificationType} from "@biit-solutions/wizardry-theme/info";
import {Environment} from "../../../../environments/environment";
import {
  CalendarProvider,
  ExternalCredentialsService,
  GoogleCredentialsService,
  GoogleSigninService
} from "@biit-solutions/appointment-center-structure";
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
  loadingCredentials: boolean = true;

  constructor(private ref: ElementRef,
              private externalCredentialsService: ExternalCredentialsService,
              private snackbarService: BiitSnackbarService,
              private transloco: TranslocoService) {
  }


  async ngOnInit(): Promise<void> {
    this.loadingCredentials = true;
    this.msCredentialsExists = await this.checkCredentials(CalendarProvider.MICROSOFT);
    this.googleCredentialsExists = await this.checkCredentials(CalendarProvider.GOOGLE);
    this.loadingCredentials = false;
  }


  @HostListener('document:window', ['$event'])
  clickout(event: MouseEvent | PointerEvent) {
    if (!this.ref.nativeElement.contains(event.target)) {
      this.onClosed.emit();
    }
  }

  disconnectFromGoogle() {
    this.externalCredentialsService.removeToken(this.googleProvider).subscribe();
    this.googleCredentialsExists = false;
  }

  protected triggerOauthRequest(provider: CalendarProvider): void {
    this.openPopup(provider).then(() => {
      console.log("Popup closed");

      this.checkCredentials(provider).then(value => {
        switch (provider) {
          case CalendarProvider.MICROSOFT:
            this.msCredentialsExists = value;
            break;
          case CalendarProvider.GOOGLE:
            this.googleCredentialsExists = value;
            break;
        }

        if (value) {
          this.snackbarService.showNotification(this.transloco.translate('form.calendar-permissions-retrieved-success'), NotificationType.INFO, null, 5);
        } else {
          this.snackbarService.showNotification(this.transloco.translate('form.calendar-permissions-failed'), NotificationType.ERROR, null, 5)
        }
      }).catch(reason => {
        console.error("Error checking credentials", reason);
        this.snackbarService.showNotification(this.transloco.translate('form.calendar-permissions-failed'), NotificationType.ERROR, null, 5);
        switch (provider) {
          case CalendarProvider.MICROSOFT:
            this.msCredentialsExists = false;
            break;
          case CalendarProvider.GOOGLE:
            this.googleCredentialsExists = false;
            break;
        }
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

  private async openPopup(provider: CalendarProvider): Promise<void> {
    return new Promise<void>((resolve) => {
      let root = '';
      if (Environment.CONTEXT) {
        root = '/';
      }
      let popup: Window | null = null;
      switch (provider) {
        case CalendarProvider.MICROSOFT:
          popup = window.open(`${root}${Environment.CONTEXT}/microsoft`, "Microsoft OAuth", "width=500,height=700,menubar=no,toolbar=no,location=no,status=no,resizable=no,scrollbars=no");
          break;
        case CalendarProvider.GOOGLE:
          popup = window.open(`${root}${Environment.CONTEXT}/google`, "Google OAuth", "width=500,height=700,menubar=no,toolbar=no,location=no,status=no,resizable=no,scrollbars=no");
          break;
        default:
          console.error("Unsupported calendar provider for OAuth popup");
          return;
      }
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

  protected readonly CalendarProvider = CalendarProvider;
  protected readonly BiitProgressBarType = BiitProgressBarType;
}

