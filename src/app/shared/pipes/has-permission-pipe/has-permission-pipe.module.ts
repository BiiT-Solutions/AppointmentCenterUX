import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HasPermissionPipe} from "./has-permission.pipe";
import {TranslocoRootModule} from "@biit-solutions/wizardry-theme/i18n";

@NgModule({
  declarations: [HasPermissionPipe],
  exports: [
    HasPermissionPipe
  ],
  imports: [
    CommonModule
  ],
  providers: [
    TranslocoRootModule
  ]
})
export class HasPermissionPipeModule { }
