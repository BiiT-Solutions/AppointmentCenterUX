import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BiitNavbarComponent} from './biit-navbar.component';
import {BiitIconModule} from 'biit-ui/icon';
import {BiitNavMenuModule, BiitNavUserModule} from 'biit-ui/navigation';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [BiitNavbarComponent],
  imports: [
    CommonModule,
    FormsModule,
    BiitIconModule,
    BiitNavMenuModule,
    BiitNavUserModule,
  ],
  exports: [BiitNavbarComponent],
})
export class BiitNavbarModule {
}
