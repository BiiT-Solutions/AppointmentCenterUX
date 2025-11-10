import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppointmentFormComponent} from "./appointment-form.component";
import {BiitTabGroupModule} from "@biit-solutions/wizardry-theme/navigation";
import {
  BiitDatePickerModule, BiitDropdownModule,
  BiitInputTextModule,
  BiitMultiselectModule,
  BiitTextareaModule,
  BiitToggleModule
} from "@biit-solutions/wizardry-theme/inputs";
import {FormsModule} from "@angular/forms";
import {BiitButtonModule} from "@biit-solutions/wizardry-theme/button";
import {MapGetPipeModule} from "@biit-solutions/wizardry-theme/utils";
import {TranslocoRootModule} from "@biit-solutions/wizardry-theme/i18n";
import {DropdownInterfacePipeModule} from "../../pipes/dropdown-interface-pipe/dropdown-interface-pipe.module";
import {UserUuidListPipeModule} from "../../pipes/user-uuid-list-pipe/user-uuid-list-pipe.module";
import {MultiselectInterfacePipeModule} from "../../pipes/multiselect-interface-pipe/multiselect-interface-pipe.module";

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
    TranslocoRootModule,
    BiitDatePickerModule,
    BiitToggleModule,
    BiitMultiselectModule,
    BiitDropdownModule,
    BiitButtonModule,
    MapGetPipeModule,
    DropdownInterfacePipeModule,
    UserUuidListPipeModule,
    MultiselectInterfacePipeModule
  ],
  exports: [
    AppointmentFormComponent
  ]
})
export class AppointmentFormModule { }
