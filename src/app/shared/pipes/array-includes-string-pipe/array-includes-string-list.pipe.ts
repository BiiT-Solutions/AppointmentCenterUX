import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'includesString',
  pure: false,
})
export class ArrayIncludesStringListPipe implements PipeTransform {

  constructor() {
  }

  transform(uuid: string, array: string[]): boolean {
    if (!array) {
      return false;
    }
    return array.includes(uuid);
  }
}
