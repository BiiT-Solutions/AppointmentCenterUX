import { Pipe, PipeTransform } from '@angular/core';
import {User} from "@biit-solutions/authorization-services";
import {TranslocoService} from "@ngneat/transloco";

@Pipe({
  name: 'userNameList',
  pure: false,
})
export class UserNameListPipe implements PipeTransform {

  constructor(private transloco: TranslocoService) {
  }

  transform(uuids: string[], speakers: User[]): string {
    if (uuids.length == 0) {
      return `(${this.transloco.translate('empty')})`;
    }
    const selected = speakers.filter(u => uuids.includes(u.uuid));
    return selected.map(u => u.name + " " + u.lastname).join(", ");
  }
}
