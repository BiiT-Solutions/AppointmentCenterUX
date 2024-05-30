import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserUuidListPipe} from "./user-uuid-list.pipe";

@NgModule({
  declarations: [UserUuidListPipe],
  exports: [
    UserUuidListPipe
  ],
  imports: [
    CommonModule
  ]
})
export class UserUuidListPipeModule { }
