import {Injectable} from "@angular/core";
import {Environment} from "../../environments/environment";
import {Subject} from "rxjs";

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleEventsService {
  scopes: string[] = ['https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events'];
  discoveryDocs: string[] = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

  handleGenerateSessionTokenFromAuthResponse(userData: any) {

  }
}
