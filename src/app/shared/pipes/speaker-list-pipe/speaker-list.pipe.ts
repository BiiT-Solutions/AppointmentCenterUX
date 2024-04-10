import { Pipe, PipeTransform } from '@angular/core';
import {User} from "authorization-services-lib";
import {AppointmentTemplate} from "appointment-center-structure-lib";

@Pipe({
  name: 'speakerList',
  pure: false,
})
export class SpeakerListPipe implements PipeTransform {

  transform(template: AppointmentTemplate, speakers: User[]): string {
    const selected = speakers.filter(u => template.speakers.includes(u.id));
    return selected.map(u => u.name + " " + u.lastname).join(", ");
  }
}
