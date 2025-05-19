import {Component, OnInit} from '@angular/core';
import {Environment} from "../../../environments/environment";
import {ActivatedRoute} from "@angular/router";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {biitIcon} from "biit-icons-collection";
import {ExternalCredentialsService, ExternalCalendarCreadentials, CalendarProvider} from "appointment-center-structure-lib";
import {MsCredentials} from "./ms-credentials";
import {addMinutes} from "date-fns";
import {MsUser} from "./ms-user";

@Component({
  selector: 'app-ms-auth',
  templateUrl: './ms-auth.component.html',
  styleUrls: ['./ms-auth.component.scss']
})
export class MsAuthComponent implements  OnInit {

  private readonly PKCE_CODE_VERIFIER: string = 'ms.pkce_code_verifier';
  private readonly STATE: string = 'ms.state';

  protected keyIcon: biitIcon;
  protected status: string = '';

  constructor(
    private route: ActivatedRoute,
    private externalCredentialsServices: ExternalCredentialsService,
    private http: HttpClient) {
  }

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe((params) => {
      const code: string = params['code'];
      const codeVerifier: string = sessionStorage.getItem(this.PKCE_CODE_VERIFIER);
      if (code) {
        this.keyIcon = 'user_add';
        this.status = 'Registering your credentials, please wait...'
        if (!codeVerifier) {
          window.close();
          return;
        }
       this.getToken(code, codeVerifier);
      } else {
        this.keyIcon = 'key_' + (Math.floor(Math.random() * 20) + 1).toString().padStart(2, '0') as biitIcon;
        this.status = 'Connecting to Microsoft, please wait...'
        setTimeout(() => {
          this.sendRequest();
        }, 1000);
      }
    });

  }

  private getToken(code: string, codeVerifier: string): void {
    const body = new HttpParams()
      .set('client_id', Environment.MS_API_CLIENT_ID)
      .set('grant_type', 'authorization_code')
      .set('code', code)
      .set('redirect_uri', Environment.MS_API_REDIRECT)
      .set('code_verifier', codeVerifier);

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    this.http.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', body, { headers })
      .subscribe({
        next: (response) => {
          debugger
          const credential: MsCredentials = MsCredentials.clone(response as MsCredentials);
          const externalCredentials: ExternalCalendarCreadentials = new ExternalCalendarCreadentials();
          externalCredentials.provider = CalendarProvider.MICROSOFT;
          externalCredentials.calendarProvider = CalendarProvider.MICROSOFT;
          externalCredentials.credentialData = credential;
          externalCredentials.userCredentials = credential.access_token;
          externalCredentials.expiresAt = addMinutes(new Date(), credential.expires_in);
          this.http.get('https://graph.microsoft.com/v1.0/me', {
            headers: { Authorization: `Bearer ${credential.access_token}` }
          }).subscribe(user => {
            this.externalCredentialsServices.createOwnCredentials(externalCredentials).subscribe({
              next: () => {
                this.status = 'Credentials registered successfully';
                setTimeout(() => {
                  window.close();
                }, 1000);
              },
              error: (error) => {
                console.error('Error creating credentials:', error);
                this.status = 'Error registering credentials';
              }
            })
          });
        },
        error: (error) => {
          console.error('Error getting token:', error);
          window.close();
        }
      });
  }

  private async sendRequest(): Promise<void> {
    const codeVerifier: string = this.generateCodeVerifier();
    sessionStorage.setItem(this.PKCE_CODE_VERIFIER, codeVerifier);
    const state: string = sessionStorage.getItem(this.STATE);
    sessionStorage.setItem(this.STATE, crypto.randomUUID());
    const codeChallenge: string = await this.generateCodeChallenge(codeVerifier);

    const params = new URLSearchParams({
      client_id: Environment.MS_API_CLIENT_ID,
      response_type: 'code',
      redirect_uri: Environment.MS_API_REDIRECT,
      response_mode: 'query',
      scope: Environment.MS_API_SCOPES.join(' '),
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    });
    window.location.href = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}`;
  }

  async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return this.base64UrlEncode(digest);
  }

  private generateCodeVerifier(length = 128): string {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, b => ('0' + (b % 36).toString(36)).slice(-1)).join('');
  }

  private base64UrlEncode(str: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(str)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
}
