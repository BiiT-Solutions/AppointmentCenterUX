import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserNameListPipe} from "./user-name-list.pipe";
import {TranslocoRootModule} from "@biit-solutions/wizardry-theme/i18n";

@NgModule({
  declarations: [UserNameListPipe],
  exports: [
    UserNameListPipe
  ],
  imports: [
    CommonModule,
    TranslocoRootModule
  ],
  providers: [
    TranslocoRootModule
  ]
})
export class UserNameListPipeModule { }
