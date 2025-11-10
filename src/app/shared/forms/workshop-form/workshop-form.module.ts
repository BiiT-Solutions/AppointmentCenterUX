import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {WorkshopFormComponent} from "./workshop-form.component";
import {BiitTabGroupModule} from "@biit-solutions/wizardry-theme/navigation";
import {
  BiitDatePickerModule, BiitDropdownModule,
  BiitInputTextModule,
  BiitMultiselectModule,
  BiitTextareaModule,
  BiitToggleModule
} from "@biit-solutions/wizardry-theme/inputs";
import {FormsModule} from "@angular/forms";
import {TranslocoModule} from "@ngneat/transloco";
import {BiitButtonModule} from "@biit-solutions/wizardry-theme/button";
import {MapGetPipeModule} from "@biit-solutions/wizardry-theme/utils";
import {MultiselectInterfacePipeModule} from "../../pipes/multiselect-interface-pipe/multiselect-interface-pipe.module";
import {DropdownInterfacePipeModule} from "../../pipes/dropdown-interface-pipe/dropdown-interface-pipe.module";

@NgModule({
  declarations: [
    WorkshopFormComponent
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
        MapGetPipeModule,
        MultiselectInterfacePipeModule,
        DropdownInterfacePipeModule
    ],
  exports: [
    WorkshopFormComponent
  ]
})
export class WorkshopFormModule { }
