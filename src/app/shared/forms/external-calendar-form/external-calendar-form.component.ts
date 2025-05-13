import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {provideTranslocoScope, TranslocoService} from "@ngneat/transloco";
import {GoogleSigninService} from "../../../services/google.signin.service";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {GoogleCredentialsService} from "../../../services/google.credentials.service";
import {Environment} from "../../../../environments/environment";

declare const google: any;

@Component({
  selector: 'external-calendar-form',
  templateUrl: './external-calendar-form.component.html',
  styleUrls: ['./external-calendar-form.component.scss'],
  providers: [provideTranslocoScope({scope: 'components/external-calendar', alias: 'form'})]
})
export class ExternalCalendarFormComponent implements OnInit {

  @Output() onClosed: EventEmitter<void> = new EventEmitter<void>();

  private user: any;

  constructor(private googleSigninService: GoogleSigninService,
              private googleCredentialsService: GoogleCredentialsService,
              private snackbarService: BiitSnackbarService,
              private transloco: TranslocoService) {
  }


  ngOnInit(): void {
    // this.googleSigninService.initializeSignIn((userData: any) => {
    //   this.snackbarService.showNotification(this.transloco.translate('form.signInWithGoogleSuccess', {user: userData.name}), NotificationType.INFO, null, 5);
    //   //Get the google session token.
    //   this.onSigninComplete(userData);
    // });
    this.googleSigninService.initializeOauthClient((code: string, state: string) => {
      if (state === Environment.GOOGLE_API_STATE) {
        this.snackbarService.showNotification(this.transloco.translate('form.calendarPermissionsRetrievedSuccess'), NotificationType.INFO, null, 5);
        this.googleCredentialsService.exchangeGoogleAuthCodeByToken(code).subscribe();
      } else {
        this.snackbarService.showNotification(this.transloco.translate('form.calendarPermissionsFailed'), NotificationType.INFO, null, 5);
      }
    });
  }


  triggerGoogleSignIn(): void {
    // this.googleSigninService.signIn();
    this.googleSigninService.requestGoogleAuthCode();
  }


  disconnectFromGoogle() {
    this.googleSigninService.signOut();
    this.user = null;
  }


  private onSigninComplete = (userProfileData: any) => {
    this.user = userProfileData;
    this.googleSigninService.persistLogin(userProfileData);
  }


}
