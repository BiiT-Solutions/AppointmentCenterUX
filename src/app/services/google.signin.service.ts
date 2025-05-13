import {Injectable} from "@angular/core";
import {Environment} from "../../environments/environment";

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleSigninService {

  scopes: string[] = ['https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events'];
  discoveryDocs: string[] = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

  private client: any;

  private signinCompleteCallback: (userData: string) => void;
  private oauthCompleteCallback: (code: string, state: string) => void;


  initializeSignIn(_signinCompleteCallback = (response: any): void => {
  }): void {
    this.signinCompleteCallback = _signinCompleteCallback;
    google.accounts.id.initialize({
      client_id: Environment.GOOGLE_API_CLIENT_ID,
      callback: this.handleSignInResponse.bind(this),
      fetch_basic_profile: true,
      scope: this.scopes.join(' '),
      discoveryDocs: this.discoveryDocs,
      state: Environment.GOOGLE_API_STATE,
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

  handleSignInResponse(response: any): void {
    this.signinCompleteCallback(this.decodeJWTToken(response.credential));
  }

  decodeJWTToken(token: string) {
    return JSON.parse(atob(token.split(".")[1]))
  }


  persistLogin(user: any): void {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
  }

  removeLogin(): void {
    localStorage.removeItem('loggedInUser');
  }


  initializeOauthClient(_oauthCompleteCallback = (code: string, state: string): void => {
  }): void {
    this.oauthCompleteCallback = _oauthCompleteCallback;
    this.client = google.accounts.oauth2.initCodeClient({
      client_id: Environment.GOOGLE_API_CLIENT_ID,
      callback: this.handleRequestCodeResponse.bind(this),
      fetch_basic_profile: true,
      scope: this.scopes.join(' '),
      discoveryDocs: this.discoveryDocs,
      state: Environment.GOOGLE_API_STATE,
    });
  }

  requestGoogleAuthCode() {
    if (this.client) {
      this.client.requestCode();
    }
  }

  handleRequestCodeResponse(response: any): void {
    this.oauthCompleteCallback(response.code, response.state);
  }

}
