import {Appointment} from "appointment-center-structure-lib";
import {CalendarEvent} from "biit-ui/calendar";

export class CalendarEventConversor {
  public static convertToCalendarEvent(appointment: Appointment): CalendarEvent {
    return new CalendarEvent(appointment.title, appointment.startTime, appointment.endTime);
  }
}
