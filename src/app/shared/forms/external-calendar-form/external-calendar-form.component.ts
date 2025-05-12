import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {provideTranslocoScope} from "@ngneat/transloco";
import {Environment} from "../../../../environments/environment";
import {GoogleSigninService} from "../../../services/google.signin.service";

declare const google: any;
declare const gapi: any;

@Component({
  selector: 'external-calendar-form',
  templateUrl: './external-calendar-form.component.html',
  styleUrls: ['./external-calendar-form.component.scss'],
  providers: [provideTranslocoScope({scope: 'components/external-calendar', alias: 'form'})]
})
export class ExternalCalendarFormComponent implements OnInit {

  @Output() onClosed: EventEmitter<void> = new EventEmitter<void>();

  constructor(private googleSigninService: GoogleSigninService) {
  }

  ngOnInit(): void {
    this.initializeGoogleSignIn();
  }

  connectToGoogle() {

  }

  disconnectFromGoogle() {

  }

  initGoogleOAuth(): Promise<any> {
    return new Promise((resolve, reject) => {
      gapi.load('auth2', async () => {
        const gAuth = await gapi.auth2.init({
          client_id: Environment.GOOGLE_API_CLIENT_ID,
          fetch_basic_profile: true,
          scope: 'profile email'
        });
        resolve(gAuth);
      }, reject);
    });
  }

  initializeGoogleSignIn(): void {
    google.accounts.id.initialize({
      client_id: '35176278264-n0vtfrl4nm920vv4kgj34ptbjn9bkqk6.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this)
    });
  }

  triggerGoogleSignIn(): void {
    console.debug('Triggering google signing');
    google.accounts.id.prompt();
    google.accounts.id.prompt((notification: any) => {
      console.log(notification);
      if (notification.isNotDisplayed()) {
        // Try manual rendering
        google.accounts.id.renderButton(
          document.getElementById("googleLoginButton"),
          {theme: "filled_black", size: "large", text: "continue_with"}
        );
      }
    });
  }

  handleCredentialResponse(response: any) {
    this.handleOauthResponse(response);
  }

  decodeJWTToken(token: string) {
    return JSON.parse(atob(token.split(".")[1]))
  }

  handleOauthResponse(response: any) {
    console.log(response);
    const responsePayload = this.decodeJWTToken(response.credential)
    console.log('--->', responsePayload, '<----')
    //Changed the above URL where you want user to be redirected
  }
}
