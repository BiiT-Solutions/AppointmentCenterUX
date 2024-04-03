import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppointmentFormComponent} from "./appointment-form.component";
import {BiitTabGroupModule} from "biit-ui/navigation";
import {
  BiitDatePickerModule, BiitDropdownModule,
  BiitInputTextModule,
  BiitMultiselectModule,
  BiitTextareaModule,
  BiitToggleModule
} from "biit-ui/inputs";
import {FormsModule} from "@angular/forms";
import {TranslocoModule} from "@ngneat/transloco";
import {BiitButtonModule} from "biit-ui/button";
import {MapGetPipeModule} from "biit-ui/utils";

@NgModule({
  declarations: [
    AppointmentFormComponent
  ],
  imports: [
    CommonModule,
    BiitTabGroupModule,
    BiitInputTextModule,
    FormsModule,
    BiitTextareaModule,
    TranslocoModule,
    BiitDatePickerModule,
    BiitToggleModule,
    BiitMultiselectModule,
    BiitDropdownModule,
    BiitButtonModule,
    MapGetPipeModule
  ],
  exports: [
    AppointmentFormComponent
  ]
})
export class AppointmentFormModule { }
