import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserNameListPipe} from "./user-name-list.pipe";

@NgModule({
  declarations: [UserNameListPipe],
  exports: [
    UserNameListPipe
  ],
  imports: [
    CommonModule,
  ]
})
export class UserNameListPipeModule { }
