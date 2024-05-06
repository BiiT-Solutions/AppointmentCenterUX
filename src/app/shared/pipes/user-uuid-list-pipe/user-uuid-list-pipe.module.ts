import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserUuidListPipe} from "./user-uuid-list.pipe";
import {TranslocoRootModule} from "biit-ui/i18n";

@NgModule({
  declarations: [UserUuidListPipe],
  exports: [
    UserUuidListPipe
  ],
  imports: [
    CommonModule,
    TranslocoRootModule
  ],
  providers: [
    TranslocoRootModule
  ]
})
export class UserUuidListPipeModule { }
