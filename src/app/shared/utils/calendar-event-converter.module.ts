import {Appointment, DayOfWeek} from "appointment-center-structure-lib";
import {CalendarEvent, EventColor} from "biit-ui/calendar";
import {NgModule} from "@angular/core";
import {ColorThemePipeModule} from "../pipes/color-theme-event/color-theme-pipe.module";
import {ScheduleRange} from "appointment-center-structure-lib/lib/models/schedule-range";

@NgModule({
  imports: [
    ColorThemePipeModule
  ]
})
export class CalendarEventConverter {
  public static convertToCalendarEvent(appointment: Appointment): CalendarEvent {
    // @ts-ignore
    return new CalendarEvent(appointment.id, appointment.title, appointment.startTime, appointment.endTime, appointment.allDay, EventColor[appointment.colorTheme], undefined, true, true, appointment);
  }


  public static convertRangeToCalendarEvent(scheduleRange: ScheduleRange): CalendarEvent {
    const today: Date = new Date(DayOfWeek.getNumber(scheduleRange.dayOfWeek));
    return new CalendarEvent(scheduleRange.id, "",
      new Date(today.getFullYear(), today.getMonth(), today.getDay(), scheduleRange.startTime.hours, scheduleRange.endTime.minutes),
      new Date(today.getFullYear(), today.getMonth(), today.getDay(), scheduleRange.endTime.hours, scheduleRange.endTime.minutes),
      false, EventColor.RED, undefined, false, true);
  }


  private getDayOfCurrentWeek(d: number): Date {
    const date = new Date(d);
    const day: number = date.getDay(); // Sunday - Saturday : 0 - 6
    //  Day of month - day of week (-6 if Sunday), otherwise +1
    const diff: number = date.getDate() - day + (day === 0 ? -6 : 1);
    date.setDate(diff);
    return date;
  }
}
