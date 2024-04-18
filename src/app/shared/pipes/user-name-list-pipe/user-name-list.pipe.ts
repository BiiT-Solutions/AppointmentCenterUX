import { Pipe, PipeTransform } from '@angular/core';
import {User} from "authorization-services-lib";
import {TranslocoService} from "@ngneat/transloco";

@Pipe({
  name: 'userNameList',
  pure: false,
})
export class UserNameListPipe implements PipeTransform {

  constructor(private transloco: TranslocoService) {
  }

  transform(ids: number[], speakers: User[]): string {
    if (ids.length == 0) {
      return `(${this.transloco.translate('empty')})`
    }
    const selected = speakers.filter(u => ids.includes(u.id));
    return selected.map(u => u.name + " " + u.lastname).join(", ");
  }
}
