import { Pipe, PipeTransform } from '@angular/core';
import { minutesToHours } from 'date-fns';

@Pipe({
  name: 'timeDuration',
  pure: false,
})
export class TimeDurationPipe implements PipeTransform {

  transform(minutes: number): string {
    const hours = minutesToHours(minutes);
    const remainingMinutes = minutes - (hours * 60);
    if (hours) {
      return hours + ' H ' + remainingMinutes + ' min';
    } else {
      return remainingMinutes + ' min';
    }
  }

}
