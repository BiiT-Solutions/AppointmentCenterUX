import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {WorkshopFormComponent} from "./workshop-form.component";
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
