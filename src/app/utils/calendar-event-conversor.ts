import {Appointment} from "appointment-center-structure-lib";
import {CalendarEvent, EventColor} from "biit-ui/calendar";
import {NgModule} from "@angular/core";
import {ColorThemePipeModule} from "../shared/pipes/color-theme-event/color-theme-pipe.module";

@NgModule({
  imports: [
    ColorThemePipeModule
  ]
})
export class CalendarEventConversor {
  public static convertToCalendarEvent(appointment: Appointment): CalendarEvent {
    // @ts-ignore
    return new CalendarEvent(appointment.id, appointment.title, appointment.startTime, appointment.endTime, appointment.allDay, EventColor[appointment.colorTheme], undefined, true, true, appointment);
  }
}
