import { Pipe, PipeTransform } from '@angular/core';
import {User} from "authorization-services-lib";

@Pipe({
  name: 'userNameList',
  pure: false,
})
export class UserNameListPipe implements PipeTransform {

  transform(ids: number[], speakers: User[]): string {
    const selected = speakers.filter(u => ids.includes(u.id));
    return selected.map(u => u.name + " " + u.lastname).join(", ");
  }
}
