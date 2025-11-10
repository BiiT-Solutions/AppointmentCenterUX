import {CalendarUtility} from "@biit-solutions/wizardry-theme/calendar/biit-calendar/calendar-utility";
import {DayOfWeek} from "@biit-solutions/appointment-center-structure";
import {Translation, TranslocoService} from "@ngneat/transloco";
import { combineLatest, Observable} from "rxjs";
export class ScheduleCalendarUtility implements CalendarUtility {

  private weekdays: string[] = [];

  constructor(private translocoService: TranslocoService) {
    const observables: Observable<Translation>[] = Array.from({length: 7}, (_, i) => i).map((i) => this.translocoService.selectTranslate(`${DayOfWeek.getByNumber(i).toString().toLowerCase()}`, {}, {scope: 'components/appointment_center'}));
    combineLatest(observables).subscribe(
      {
        next: (translations: Translation[]) => {
          this.weekdays = translations.map(t => t.toString());
        }
      }
    );
  }

  customHeaderDate(date: Date): string {
    if (!date) {
      return "-";
    }
    return this.dateToDayOfWeek(date);
  }

  private dateToDayOfWeek(date: Date): string {
    const parsedDate = new Date(date);
    return this.weekdays[date.getDay()] || parsedDate.toLocaleDateString(undefined, {weekday: "long"});
  }

}
