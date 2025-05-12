import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {provideTranslocoScope} from "@ngneat/transloco";

@Component({
  selector: 'external-calendar-form',
  templateUrl: './external-calendar-form.component.html',
  styleUrls: ['./external-calendar-form.component.scss'],
  providers: [provideTranslocoScope({scope: 'components/external-calendar', alias: 'form'})]
})
export class ExternalCalendarFormComponent implements OnInit {

  @Output() onClosed: EventEmitter<void> = new EventEmitter<void>();


  ngOnInit(): void {
  }

  connectToGoogle() {

  }

  disconnectFromGoogle() {

  }
}
