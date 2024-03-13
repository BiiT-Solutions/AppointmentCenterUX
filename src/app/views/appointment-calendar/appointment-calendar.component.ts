import { Component } from '@angular/core';
import {CalendarEvent, CalendarMode} from "biit-ui/calendar";

@Component({
  selector: 'app-appointment-calendar',
  templateUrl: './appointment-calendar.component.html',
  styleUrls: ['./appointment-calendar.component.scss']
})
export class AppointmentCalendarComponent {
  protected viewDate: Date = new Date();
  protected events: CalendarEvent[] = [];
  protected readonly CalendarMode = CalendarMode;
}
