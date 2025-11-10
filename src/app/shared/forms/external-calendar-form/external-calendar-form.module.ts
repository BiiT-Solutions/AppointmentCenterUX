import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExternalCalendarFormComponent } from './external-calendar-form.component';
import {BiitTabGroupModule} from "@biit-solutions/wizardry-theme/navigation";
import {BiitPopupModule} from "@biit-solutions/wizardry-theme/popup";
import {BiitButtonModule} from "@biit-solutions/wizardry-theme/button";
import {TranslocoModule} from "@ngneat/transloco";
import {BiitProgressBarModule} from "@biit-solutions/wizardry-theme/info";



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
