import {Component} from '@angular/core';
import {Environment} from "../environments/environment";
import {BiitSnackbarHorizontalPosition, BiitSnackbarService, BiitSnackbarVerticalPosition} from "biit-ui/info";
import {AvailableLangs, TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {Route, Router} from "@angular/router";
import {completeIconSet} from "biit-icons-collection";
import {BiitIconService} from "biit-ui/icon";
import {AppointmentCenterStructureRootService, SessionService} from "appointment-center-structure-lib";
import {UserManagerRootService} from "user-manager-structure-lib";
import {PermissionService} from "./services/permission.service";
import {User} from "authorization-services-lib";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/main', alias: 'main'}
    }
  ]
})
export class AppComponent {
  protected menu: Route[]= [];
  constructor(appointmentCenterStructureRootService: AppointmentCenterStructureRootService,
              userManagerRootService: UserManagerRootService,
              biitSnackbarService: BiitSnackbarService,
              biitIconService: BiitIconService,
              protected sessionService: SessionService,
              private permissionService: PermissionService,
              private router: Router,
              private translocoService: TranslocoService) {
    this.setLanguage();
    appointmentCenterStructureRootService.serverUrl = new URL(`${Environment.ROOT_URL}${Environment.APPOINTMENT_CENTER_PATH}`);
    userManagerRootService.serverUrl = new URL(`${Environment.ROOT_URL}${Environment.USER_MANAGER_PATH}`);
    biitSnackbarService.setPosition(BiitSnackbarVerticalPosition.TOP, BiitSnackbarHorizontalPosition.CENTER);
    biitIconService.registerIcons(completeIconSet);
    this.setPermissions();
  }

  private setPermissions(): void {
    const user: User = this.sessionService.getUser();
    if (!user) {
      return;
    }
    this.permissionService.setRole(user.applicationRoles);
  }

  private setLanguage(): void {
    const clientLanguages: ReadonlyArray<string>= navigator.languages;
    const languages: AvailableLangs = this.translocoService.getAvailableLangs();
    const language: string = clientLanguages.find(lang => languages.map(lang => lang.toString()).includes(lang));
    if (language) {
      this.translocoService.setActiveLang(language);
    }
  }

  logout() {
    this.router.navigate(['/login'], {queryParams: {logout: true}});
  }
}
