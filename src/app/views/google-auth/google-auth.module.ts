import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleAuthComponent } from './google-auth.component';
import {GoogleAuthRoutingModule} from "./google-auth-routing.module";
import {BiitIconModule} from "@biit-solutions/wizardry-theme/icon";



@NgModule({
  declarations: [
    GoogleAuthComponent
  ],
  exports: [
    GoogleAuthComponent
  ],
  imports: [
    CommonModule,
    GoogleAuthRoutingModule,
    BiitIconModule
  ]
})
export class GoogleAuthModule { }
