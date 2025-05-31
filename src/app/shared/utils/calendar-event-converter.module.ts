import {Appointment, CalendarProvider, DayOfWeek} from "appointment-center-structure-lib";
import {CalendarEvent, EventColor} from "biit-ui/calendar";
import {NgModule} from "@angular/core";
import {ColorThemePipeModule} from "../pipes/color-theme-event/color-theme-pipe.module";
import {ScheduleRange} from "appointment-center-structure-lib/lib/models/schedule-range";
import {startOfWeek} from 'date-fns'

@NgModule({
  imports: [
    ColorThemePipeModule
  ]
})
export class CalendarEventConverter {
  public static convertToCalendarEvent(appointment: Appointment): CalendarEvent {
    const event: CalendarEvent = new CalendarEvent(appointment.id, appointment.title, appointment.startTime,
      appointment.endTime, !appointment.calendarProvider,
      appointment.allDay, (EventColor as any)[appointment.colorTheme], undefined, true, !appointment.calendarProvider, appointment);
    if (appointment.calendarProvider) {
      switch (appointment.calendarProvider) {
        case CalendarProvider.MICROSOFT:
          event.color = EventColor.BLUE;
          break;
        case CalendarProvider.GOOGLE:
          event.color = EventColor.YELLOW;
          break;
        case CalendarProvider.APPLE:
          event.color = EventColor.RED;
      }
    }
    return event;
  }

  public static convertRangeToCalendarEvent(scheduleRange: ScheduleRange): CalendarEvent {
    const dateOnWeek: Date = CalendarEventConverter.getDateByDayOfWeek(scheduleRange.dayOfWeek);
    let startTime: string[] = scheduleRange.startTime.split(':');
    let endTime: string[] = scheduleRange.endTime.split(':');
    const startEvent: Date = new Date(dateOnWeek);
    startEvent.setHours(+startTime[0] || 0, +startTime[1] || 0);
    const endEvent: Date = new Date(dateOnWeek);
    endEvent.setHours(+endTime[0] || 23, +endTime[1] || 59);
    return new CalendarEvent(scheduleRange.id, "",
      startEvent, endEvent, false, false, EventColor.RED, undefined, false, true);
  }

  private static getDateByDayOfWeek(dayOfWeek: DayOfWeek): Date {
    const startingWeekDay = CalendarEventConverter.getFirstDayOfWeek()
    let currentWeekDay: number = new Date().getDay() - startingWeekDay;
    // This happens when the current day is Sunday
    if (currentWeekDay < 0) {
      currentWeekDay = 6;
    }
    // DayOfWeek starts already on Monday
    let dayOfWeekNumber: number = DayOfWeek.getNumber(dayOfWeek);
    if (dayOfWeekNumber > 6) {
      dayOfWeekNumber = 0;
    }
    const difference: number = dayOfWeekNumber - currentWeekDay;
    return new Date(new Date().setDate(new Date().getDate() + difference));
  }

  private static getFirstDayOfWeek(): number {
    return startOfWeek(new Date()).getDay();
  }

}
