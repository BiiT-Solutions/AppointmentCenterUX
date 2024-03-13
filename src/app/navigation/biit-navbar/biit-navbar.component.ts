import {Component, OnInit} from '@angular/core';
import {Route, Router} from '@angular/router';
import {provideTranslocoScope, TranslocoService} from '@ngneat/transloco';
import {User} from 'authorization-services-lib';
import {Constants} from '../../shared/constants';
import {AuthGuard} from '../../services/auth-guard.service';
import {PermissionService} from "../../services/permission.service";
import {Permission} from "../../config/rbac/permission";
import {SessionService} from "appointment-center-structure-lib";

@Component({
  selector: 'biit-navbar',
  templateUrl: './biit-navbar.component.html',
  styleUrls: ['./biit-navbar.component.scss'],
  providers: [provideTranslocoScope('navigation')]
})

export class BiitNavbarComponent implements OnInit {
  user: User;
  constructor(protected router: Router,
              private sessionService: SessionService,
              private permissionService: PermissionService,
              private translocoService: TranslocoService) {
  }

  routes: Route[] = [];

  ngOnInit() {

    this.routes = [
      {
        path: Constants.PATHS.APPOINTMENTS,
        canActivate: [AuthGuard],
        title: 'Appointment Center',
        data: {
          hidden: !this.permissionService.hasPermission(Permission.APPOINTMENT_CENTER.ROOT)
        }
      }
    ];
    this.routes.forEach(route => {
      this.translocoService.selectTranslate(route.title as string, {},  {scope: 'navigation'}).subscribe(value => route.title = value);

      route.children?.forEach(child => {
        this.translocoService.selectTranslate(child.title as string, {},  {scope: 'navigation'}).subscribe(value => child.title = value);
      })
    });
    this.user = this.sessionService.getUser();
  }

  log(event: any) {
    console.log("DEVELOPMENT LOG: ", event);
  }
}
