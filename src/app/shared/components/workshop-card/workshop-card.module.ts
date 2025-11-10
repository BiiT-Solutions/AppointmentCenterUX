import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {WorkshopCardComponent} from "./workshop-card.component";
import {BiitIconModule} from "@biit-solutions/wizardry-theme/icon";
import {UserNameListPipeModule} from "../../pipes/user-name-list-pipe/user-name-list-pipe.module";
import {EventCardDatePipeModule} from "../../pipes/event-card-date-pipe/event-card-date-pipe.module";
import {BiitButtonModule} from "@biit-solutions/wizardry-theme/button";
import {TranslocoRootModule} from "@biit-solutions/wizardry-theme/i18n";
import {HasPermissionPipeModule} from "../../pipes/has-permission-pipe/has-permission-pipe.module";
import {TimeDurationPipeModule} from "../../pipes/time-duration-pipe/time-duration-pipe.module";

@NgModule({
  declarations: [
    WorkshopCardComponent
  ],
  imports: [
    CommonModule,
    BiitIconModule,
    UserNameListPipeModule,
    EventCardDatePipeModule,
    BiitButtonModule,
    TranslocoRootModule,
    HasPermissionPipeModule,
    TimeDurationPipeModule
  ],
  exports: [
    WorkshopCardComponent
  ]
})
export class WorkshopCardModule { }
