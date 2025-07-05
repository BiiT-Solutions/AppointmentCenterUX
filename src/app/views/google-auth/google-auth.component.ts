import {Component, OnInit} from '@angular/core';
import {biitIcon} from "biit-icons-collection";
import {ActivatedRoute} from "@angular/router";
import {
  CalendarProvider,
  ExternalCalendarCredentials,
  ExternalCredentialsService,
  SessionService
} from "appointment-center-structure-lib";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Environment} from "../../../environments/environment";
import {MsCredentials} from "../ms-auth/ms-credentials";
import {addMinutes, format} from "date-fns";
import {CredentialData} from "./CredentialData";

@Component({
  selector: 'app-google-auth',
  templateUrl: './google-auth.component.html',
  styleUrls: ['./google-auth.component.scss']
})
export class GoogleAuthComponent implements  OnInit {

  private readonly PKCE_CODE_VERIFIER: string = 'gg.pkce_code_verifier';
  private readonly STATE: string = 'gg.state';

  protected keyIcon: biitIcon;
  protected status: string = 'Testing Google authentication, please wait...';

  constructor(
    private route: ActivatedRoute,
    private externalCredentialsServices: ExternalCredentialsService,
    private sessionService: SessionService,
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
        this.status = 'Connecting to Google Services, please wait...'
        setTimeout(() => {
          this.sendRequest();
        }, 2000);
      }
    });
  }
  private getToken(code: string, codeVerifier: string): void {
    const body = new HttpParams()
      .set('client_id', Environment.GOOGLE_API_CLIENT_ID)
      .set('grant_type', 'authorization_code')
      .set('code', code)
      .set('redirect_uri', Environment.GOOGLE_API_REDIRECT)
      .set('client_secret', Environment.GOOGLE_API_CLIENT_SECRET)
      .set('code_verifier', codeVerifier);

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    this.http.post('https://oauth2.googleapis.com/token', body, { headers })
      .subscribe({
        next: (response) => {
          const credential: MsCredentials = MsCredentials.clone(response as MsCredentials);
          const externalCredentials: ExternalCalendarCredentials = new ExternalCalendarCredentials();
          externalCredentials.provider = CalendarProvider.GOOGLE;
          externalCredentials.calendarProvider = CalendarProvider.GOOGLE;
          externalCredentials.userId = this.sessionService.getUser().uuid;
          const credentialData: CredentialData = new CredentialData();
          credentialData.accessToken = credential.access_token;
          credentialData.refreshToken = credential.refresh_token;
          credentialData.expirationTimeMilliseconds = credential.expires_in * 1000;
          credentialData.refreshTokenExpirationTimeMilliseconds = Math.floor(30 * 24 * 60 * 60 * 1000); // 30 days
          credentialData.createdAt = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
          externalCredentials.userCredentials = JSON.stringify(credentialData);
          externalCredentials.expiresAt = format(addMinutes(new Date(), credential.expires_in), "yyyy-MM-dd'T'HH:mm:ss");
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
      client_id: Environment.GOOGLE_API_CLIENT_ID,
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
      redirect_uri: Environment.GOOGLE_API_REDIRECT,
      response_mode: 'query',
      scope: Environment.GOOGLE_API_SCOPES.join(' '),
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    });
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
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
