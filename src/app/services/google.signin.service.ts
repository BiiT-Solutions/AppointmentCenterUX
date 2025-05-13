import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {Environment} from "../../environments/environment";

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleSigninService {

  scopes: string[] = ['https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events'];
  discoveryDocs: string[] = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

  private signinCompleteSource = new Subject<any>();
  private signinCompleteCallback: (value: string) => void;


  initializeSignIn(_signinCompleteCallback = (username: string): void => {
  }): void {
    this.signinCompleteCallback = _signinCompleteCallback;
    google.accounts.id.initialize({
      client_id: Environment.GOOGLE_API_CLIENT_ID,
      callback: this.handleCredentialResponse.bind(this),
      fetch_basic_profile: true,
      scope: this.scopes.join(' '),
      discoveryDocs: this.discoveryDocs
    });
  }


  signIn(): void {
    console.debug('Triggering google signing');
    google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed()) {
        // Try manual rendering
        google.accounts.id.renderButton(
          document.getElementById("googleLoginButton"),
          {theme: "filled_black", size: "large", text: "continue_with"}
        );
      }
    });
  }


  signOut() {
    console.debug('Triggering google sign out');
    google.accounts.id.disableAutoSelect();
  }

  handleCredentialResponse(response: any): void {
    // console.log(this.decodeJWTToken(response.credential));
    this.signinCompleteCallback(this.decodeJWTToken(response.credential).name);
  }

  decodeJWTToken(token: string) {
    return JSON.parse(atob(token.split(".")[1]))
  }

}
