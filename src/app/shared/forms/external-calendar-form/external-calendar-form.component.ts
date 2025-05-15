import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {provideTranslocoScope, TranslocoService} from "@ngneat/transloco";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {Environment} from "../../../../environments/environment";
import {GoogleCredentialsService, GoogleSigninService} from "appointment-center-structure-lib";

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
    // this.googleSigninService.initializeSignIn( Environment.GOOGLE_API_STATE, Environment.GOOGLE_API_CLIENT_ID, (userData: any) => {
    //   this.snackbarService.showNotification(this.transloco.translate('form.signInWithGoogleSuccess', {user: userData.name}), NotificationType.INFO, null, 5);
    //   //Get the google session token.
    //   this.onSigninComplete(userData);
    // });
    this.googleSigninService.initializeOauthClient(Environment.GOOGLE_API_STATE, Environment.GOOGLE_API_CLIENT_ID,
      (code: string, state: string) => {
        //if (state === Environment.GOOGLE_API_STATE) {
          this.snackbarService.showNotification(this.transloco.translate('form.calendarPermissionsRetrievedSuccess'), NotificationType.INFO, null, 5);
          this.googleCredentialsService.exchangeGoogleAuthCodeByTokenByParams(code, state).subscribe();
        //} else {
        //  this.snackbarService.showNotification(this.transloco.translate('form.calendarPermissionsFailed'), NotificationType.ERROR, null, 5);
        //}
      });
  }


  triggerGoogleOathRequest(): void {
    // this.googleSigninService.signIn();
    this.googleSigninService.requestGoogleAuthCode();
  }


  disconnectFromGoogle() {
    //this.googleSigninService.signOut();
    //this.user = null;
    this.googleCredentialsService.removeGoogleAuthCodeByToken().subscribe();
  }


  private onSigninComplete = (userProfileData: any) => {
    this.user = userProfileData;
    this.googleSigninService.persistLogin(userProfileData);
  }


}
