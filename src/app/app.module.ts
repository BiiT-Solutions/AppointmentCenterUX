import { registerLocaleData } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import localeEn from '@angular/common/locales/en';
import localeEs from '@angular/common/locales/es';
import localeNL from '@angular/common/locales/nl';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {TranslocoRootModule} from "biit-ui/i18n";

registerLocaleData(localeEn, 'en')
registerLocaleData(localeEs, 'es');
registerLocaleData(localeNL, 'nl');

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    TranslocoRootModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
