import {CalendarUtility} from "biit-ui/calendar/biit-calendar/calendar-utility";
import {DayOfWeek} from "appointment-center-structure-lib";
import {TranslocoService} from "@ngneat/transloco";

export class ScheduleCalendarUtility implements CalendarUtility {


  constructor(private translocoService: TranslocoService) {
  }

  customHeaderDate(date: Date): string {
    return this.translocoService.translate('app.' + DayOfWeek.getByNumber(date.getDay()).toString().toLowerCase());
  }

}
