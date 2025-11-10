import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BiitSnackbarModule} from "@biit-solutions/wizardry-theme/info";
import {TranslocoRootModule} from "@biit-solutions/wizardry-theme/i18n";
import {CommonModule, registerLocaleData} from "@angular/common";
import {HeaderInterceptor} from "./config/header-interceptor";

import localeEn from '@angular/common/locales/en';
import localeEs from '@angular/common/locales/es';
import localeNL from '@angular/common/locales/nl';
import {BiitNavbarModule} from "./navigation/biit-navbar/biit-navbar.module";

registerLocaleData(localeEn, 'en')
registerLocaleData(localeEs, 'es');
registerLocaleData(localeNL, 'nl');

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        CommonModule,
        AppRoutingModule,
        HttpClientModule,
        TranslocoRootModule,
        BiitSnackbarModule,
        BiitNavbarModule
    ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
