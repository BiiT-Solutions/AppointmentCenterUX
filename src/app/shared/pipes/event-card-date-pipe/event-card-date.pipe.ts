import { Pipe, PipeTransform } from '@angular/core';
import {CalendarEvent} from "biit-ui/calendar";
import {isSameDay} from "date-fns";
import {DatePipe} from "@angular/common";

@Pipe({
  name: 'eventCardDate',
  pure: false,
})
export class EventCardDatePipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {
  }

  transform(event: CalendarEvent): string {
    let label = "";
    if (isSameDay(event.start, event.end)) {
      label = label.concat(this.datePipe.transform(event.start, 'fullDate'));
      label = label.substring(0, label.length - 6);

      if (event.allDay) {
        return label;
      } else {
        return label.concat(' - ', this.datePipe.transform(event.start, 'H:mm'),
          ' - ', this.datePipe.transform(event.end, 'H:mm'));
      }
    } else {
      label = label.concat(this.datePipe.transform(event.start, 'fullDate'));
      label = label.substring(0, label.length - 6);

      if (event.allDay) {
        label = label.concat('<br>');
        label = label.concat(this.datePipe.transform(event.end, 'fullDate'));
        return label.substring(0, label.length - 6);
      } else {
        label = label.concat(' - ', this.datePipe.transform(event.start, 'H:mm'));
        label = label.concat('<br>');
        label = label.concat(this.datePipe.transform(event.end, 'fullDate'));
        label = label.substring(0, label.length - 6);
        return label.concat(' - ', this.datePipe.transform(event.end, 'H:mm'));
      }
    }
  }
}
