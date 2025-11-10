import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BiitNavbarComponent} from './biit-navbar.component';
import {BiitIconModule} from '@biit-solutions/wizardry-theme/icon';
import {BiitNavMenuModule, BiitNavUserModule} from '@biit-solutions/wizardry-theme/navigation';
import {FormsModule} from "@angular/forms";
import {TranslocoRootModule} from "@biit-solutions/wizardry-theme/i18n";
import {ContextMenuModule} from "@perfectmemory/ngx-contextmenu";
import {BiitComponentMenuModule} from "../biit-component-menu/biit-component-menu.module";

@NgModule({
  declarations: [BiitNavbarComponent],
    imports: [
        CommonModule,
        FormsModule,
        BiitIconModule,
        BiitNavMenuModule,
        BiitNavUserModule,
        TranslocoRootModule,
        ContextMenuModule,
        BiitComponentMenuModule
    ],
  exports: [BiitNavbarComponent],
})
export class BiitNavbarModule {
}
