import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {provideTranslocoScope, TranslocoService} from "@ngneat/transloco";
import {GoogleSigninService} from "../../../services/google.signin.service";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";

declare const google: any;

@Component({
  selector: 'external-calendar-form',
  templateUrl: './external-calendar-form.component.html',
  styleUrls: ['./external-calendar-form.component.scss'],
  providers: [provideTranslocoScope({scope: 'components/external-calendar', alias: 'form'})]
})
export class ExternalCalendarFormComponent implements OnInit {

  @Output() onClosed: EventEmitter<void> = new EventEmitter<void>();

  constructor(private googleSigninService: GoogleSigninService, private snackbarService: BiitSnackbarService,
              private transloco: TranslocoService) {
  }

  ngOnInit(): void {
    this.googleSigninService.initializeSignIn((username: string) => {
      console.log(this.transloco.translate('form.signInWithGoogleSuccess', {user: username}));
      this.snackbarService.showNotification(this.transloco.translate('form.signInWithGoogleSuccess', {user: username}), NotificationType.INFO, null, 5);
    });
  }

  triggerGoogleSignIn(): void {
    this.googleSigninService.signIn();
  }

  disconnectFromGoogle() {
    this.googleSigninService.signOut();
  }


}
