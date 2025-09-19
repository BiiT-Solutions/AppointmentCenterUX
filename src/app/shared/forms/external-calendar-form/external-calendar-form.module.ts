import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExternalCalendarFormComponent } from './external-calendar-form.component';
import {BiitTabGroupModule} from "biit-ui/navigation";
import {BiitPopupModule} from "biit-ui/popup";
import {BiitButtonModule} from "biit-ui/button";
import {TranslocoModule} from "@ngneat/transloco";
import {BiitProgressBarModule} from "biit-ui/info";



@NgModule({
  declarations: [
    ExternalCalendarFormComponent
  ],
  exports: [
    ExternalCalendarFormComponent
  ],
    imports: [
        CommonModule,
        BiitTabGroupModule,
        BiitPopupModule,
        BiitButtonModule,
        TranslocoModule,
        BiitProgressBarModule
    ]
})
export class ExternalCalendarFormModule { }
