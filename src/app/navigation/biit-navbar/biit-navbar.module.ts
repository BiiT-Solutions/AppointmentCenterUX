import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BiitNavbarComponent} from './biit-navbar.component';
import {BiitIconModule} from 'biit-ui/icon';
import {BiitNavMenuModule, BiitNavUserModule} from 'biit-ui/navigation';
import {FormsModule} from "@angular/forms";
import {TranslocoRootModule} from "biit-ui/i18n";
import {ContextMenuModule} from "@perfectmemory/ngx-contextmenu";

@NgModule({
  declarations: [BiitNavbarComponent],
  imports: [
    CommonModule,
    FormsModule,
    BiitIconModule,
    BiitNavMenuModule,
    BiitNavUserModule,
    TranslocoRootModule,
    ContextMenuModule
  ],
  exports: [BiitNavbarComponent],
})
export class BiitNavbarModule {
}
