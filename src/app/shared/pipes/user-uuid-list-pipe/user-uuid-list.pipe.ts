import { Pipe, PipeTransform } from '@angular/core';
import {User} from "authorization-services-lib";
import {TranslocoService} from "@ngneat/transloco";

@Pipe({
  name: 'userUuidList',
  pure: false,
})
export class UserUuidListPipe implements PipeTransform {

  constructor(private transloco: TranslocoService) {
  }

  transform(uuids: string[], users: User[]): User[] {
    if (uuids.length == 0) {
      return [];
    }
    return users.filter(u => uuids.includes(u.uuid));
  }
}
