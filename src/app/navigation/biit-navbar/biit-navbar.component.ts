import {Component, OnInit} from '@angular/core';
import {Route, Router} from '@angular/router';
import {provideTranslocoScope} from '@ngneat/transloco';
import {User} from 'authorization-services-lib';
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
              protected sessionService: SessionService) {
  }

  routes: Route[] = [];

  ngOnInit() {
    this.user = this.sessionService.getUser();
  }

  log(event: any) {
    console.log("DEVELOPMENT LOG: ", event);
  }
}

