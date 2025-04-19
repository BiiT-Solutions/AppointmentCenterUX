import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiitComponentMenuComponent } from './biit-component-menu.component';



@NgModule({
    declarations: [
        BiitComponentMenuComponent
    ],
    exports: [
        BiitComponentMenuComponent
    ],
    imports: [
        CommonModule
    ]
})
export class BiitComponentMenuModule { }
