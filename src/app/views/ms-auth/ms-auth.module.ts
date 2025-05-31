import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsAuthComponent } from './ms-auth.component';
import {MsAuthRoutingModule} from "./ms-auth-routing.module";
import {BiitIconModule} from "biit-ui/icon";



@NgModule({
  declarations: [
    MsAuthComponent
  ],
  exports: [
    MsAuthComponent
  ],
  imports: [
    CommonModule,
    MsAuthRoutingModule,
    BiitIconModule
  ]
})
export class MsAuthModule { }
