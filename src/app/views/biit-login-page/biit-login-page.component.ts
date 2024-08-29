import {Component, OnInit} from '@angular/core';
import {BiitLogin} from "biit-ui/models";
import {Constants} from "../../shared/constants";
import {HttpResponse} from "@angular/common/http";
import {BiitProgressBarType, BiitSnackbarService, NotificationType} from "biit-ui/info";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {ActivatedRoute, Router} from "@angular/router";
import {LoginRequest, User} from "authorization-services-lib";
import {AuthService as AppointmentCenterAuthService, SessionService as AppointmentCenterSessionService} from 'appointment-center-structure-lib';
import {
  AuthService as UserManagerAuthService,
  SessionService as UserManagerSessionService,
  OrganizationService, UserService
} from 'user-manager-structure-lib';
import {combineLatest} from "rxjs";
import {PermissionService} from "../../services/permission.service";

@Component({
  selector: 'biit-login-page',
  templateUrl: './biit-login-page.component.html',
  styleUrls: ['./biit-login-page.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/login', alias: 'errors'}
    }
  ]
})
export class BiitLoginPageComponent implements OnInit {

  protected readonly BiitProgressBarType = BiitProgressBarType;
  protected waiting: boolean = true;
  constructor(private appointmentCenterAuthService: AppointmentCenterAuthService,
              private appointmentCenterSessionService: AppointmentCenterSessionService,
              private userManagerAuthService: UserManagerAuthService,
              private userManagerSessionService: UserManagerSessionService,
              private organizationService: OrganizationService,
              private permissionService: PermissionService,
              private userService: UserService,
              private biitSnackbarService: BiitSnackbarService,
              private activateRoute: ActivatedRoute,
              private router: Router,
              private translocoService: TranslocoService) {
  }

  ngOnInit(): void {
    this.managePathQueries();
    if (!this.appointmentCenterSessionService.isTokenExpired()) {
      this.router.navigate([Constants.PATHS.APPOINTMENTS]);
    } else {
      this.waiting = false;
    }
  }

  login(login: BiitLogin): void {
    this.waiting = true;

    combineLatest(
      [
        this.appointmentCenterAuthService.login(new LoginRequest(login.username, login.password)),
        this.userManagerAuthService.login(new LoginRequest(login.username, login.password))
      ]
    ).subscribe({
      next: ([appointmentCenterResponse, userManagerResponse]) => {
        const user: User = User.clone(appointmentCenterResponse.body);
        if (!this.canAccess(user)) {
          this.waiting = false;
          this.translocoService.selectTranslate('403', {}, {scope: 'biit-ui/utils'}).subscribe(msg => {
            this.biitSnackbarService.showNotification(msg, NotificationType.ERROR, null, 10);
          });
          return;
        }
        this.permissionService.setRole(user.applicationRoles);

        const appointmentCenterToken: string = appointmentCenterResponse.headers.get(Constants.HEADERS.AUTHORIZATION_RESPONSE);
        const appointmentCenterExpiration: number = +appointmentCenterResponse.headers.get(Constants.HEADERS.EXPIRES);
        this.appointmentCenterSessionService.setToken(appointmentCenterToken, appointmentCenterExpiration, login.remember, true);
        this.appointmentCenterSessionService.setUser(user);

        const userManagerToken: string = userManagerResponse.headers.get(Constants.HEADERS.AUTHORIZATION_RESPONSE);
        const userManagerExpiration: number = +userManagerResponse.headers.get(Constants.HEADERS.EXPIRES);
        this.userManagerSessionService.setToken(userManagerToken, userManagerExpiration, login.remember, true);
        this.userManagerSessionService.setUser(user);

        this.organizationService.getAllByLoggedUser().subscribe(orgs => {
          if (orgs[0] !== undefined) {
            sessionStorage.setItem('organization', orgs[0].id);
          }
        });

        this.router.navigate([Constants.PATHS.APPOINTMENTS]);
      },
      error: (response: HttpResponse<void>) => {
        const error: string = response.status.toString();
        // Transloco does not load translation files. We need to load it manually;
        this.translocoService.selectTranslate(error, {},  {scope: 'biit-ui/utils'}).subscribe(msg => {
          this.biitSnackbarService.showNotification(msg, NotificationType.ERROR, null, 5);
        });
      }
    }).add(() => {
      this.waiting = false;
    });
  }

  private canAccess(user: User): boolean {
    return user.applicationRoles && user.applicationRoles.some(value => value.startsWith(Constants.APP.APP_PERMISSION_NAME));
  }

  private managePathQueries(): void {
    this.activateRoute.queryParams.subscribe(params => {
      const queryParams: {[key: string]: string} = {};
      if (params[Constants.PATHS.QUERY.EXPIRED] !== undefined) {
        this.translocoService.selectTranslate(Constants.PATHS.QUERY.EXPIRED, {},  {scope: 'biit-ui/utils'}).subscribe(msg => {
          this.biitSnackbarService.showNotification(msg, NotificationType.INFO, null, 5);
        });
        queryParams[Constants.PATHS.QUERY.EXPIRED] = null;
      }
      if (params[Constants.PATHS.QUERY.LOGOUT] !== undefined) {
        this.appointmentCenterSessionService.clearToken();
        this.userManagerSessionService.clearToken();
        this.permissionService.clear();
        this.translocoService.selectTranslate(Constants.PATHS.QUERY.LOGOUT, {},  {scope: 'biit-ui/utils'}).subscribe(msg => {
          this.biitSnackbarService.showNotification(msg, NotificationType.SUCCESS, null, 5);
        });
        queryParams[Constants.PATHS.QUERY.LOGOUT] = null;
      }
      this.router.navigate([], {queryParams: queryParams, queryParamsHandling: 'merge'});
    });
  }

  protected onResetPassword(email: string) {
    this.userService.resetPassword(email).subscribe({
      next: () => {
        this.translocoService.selectTranslate('success', {},  {scope: 'biit-ui/login'}).subscribe(msg => {
          this.biitSnackbarService.showNotification(msg, NotificationType.SUCCESS, null, 5);
        });
      },
      error: () => {
        this.translocoService.selectTranslate('error', {},  {scope: 'biit-ui/login'}).subscribe(msg => {
          this.biitSnackbarService.showNotification(msg, NotificationType.ERROR, null, 5);
        });
      }
    })
  }
}
