import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Route, Router} from '@angular/router';
import {provideTranslocoScope} from '@ngneat/transloco';
import {User} from 'authorization-services-lib';
import {SessionService} from "appointment-center-structure-lib";
import {ContextMenuComponent, ContextMenuService} from "@perfectmemory/ngx-contextmenu";
import {Constants} from "../../shared/constants";

@Component({
  selector: 'biit-navbar',
  templateUrl: './biit-navbar.component.html',
  styleUrls: ['./biit-navbar.component.scss'],
  providers: [provideTranslocoScope({scope:'components/navigation', alias:'t'})]
})

export class BiitNavbarComponent implements AfterViewInit {
  protected readonly Constants = Constants;

  @ViewChild('contextMenu') contextMenu: ContextMenuComponent<void>;
  @ViewChild('navUser', {read: ElementRef}) navUser: ElementRef;
  user: User;
  constructor(protected router: Router,
              private contextMenuService: ContextMenuService<void>,
              protected sessionService: SessionService) {
  }

  routes: Route[] = [];

  ngAfterViewInit() {
    this.user = this.sessionService.getUser();
  }

  log(event: any) {
    console.log("DEVELOPMENT LOG: ", event);
  }

  protected onContextMenu($event: Event): void {
    this.contextMenuService.show(
      this.contextMenu,
      {
        x: this.navUser.nativeElement.offsetLeft + this.navUser.nativeElement.offsetWidth,
        y: this.navUser.nativeElement.offsetHeight
      }
    );
    $event.preventDefault();
    $event.stopPropagation();
  }
}

