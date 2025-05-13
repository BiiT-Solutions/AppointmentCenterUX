import {Injectable} from "@angular/core";
import {AppointmentCenterStructureRootService, ExaminationType} from "appointment-center-structure-lib";
import {HttpClient} from "@angular/common/http";
import {Environment} from "../../environments/environment";

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleCredentialsService {
  private static readonly ROOT_PATH: string = '/external-calendar-credentials/google';

  constructor(private rootService: AppointmentCenterStructureRootService, private httpClient: HttpClient) {
  }

  exchangeGoogleAuthCodeByToken(code: string) {
    return this.httpClient.get<ExaminationType>(
      `${this.rootService.serverUrl}${GoogleCredentialsService.ROOT_PATH}/code/${code}/state/${Environment.GOOGLE_API_STATE}`);
  }
}
