import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SpeakerListPipe} from "./speaker-list.pipe";



@NgModule({
  declarations: [SpeakerListPipe],
  exports: [
    SpeakerListPipe
  ],
  imports: [
    CommonModule,
  ]
})
export class SpeakerListPipeModule { }
