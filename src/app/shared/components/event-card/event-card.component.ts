import {Component, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {provideTranslocoScope, TranslocoService} from "@ngneat/transloco";
import {CalendarEvent, CalendarEventClickEvent, castTo} from "biit-ui/calendar";
import {User} from "authorization-services-lib";

@Component({
  selector: 'event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
  providers: [provideTranslocoScope({scope: 'components/forms', alias: 'form'})]
})
export class EventCardComponent {
  @Input() event: CalendarEventClickEvent;
  @Input() speakers: User[];
  @Output() onEdit: EventEmitter<CalendarEvent> = new EventEmitter<CalendarEvent>();
  @Output() onClosed: EventEmitter<void> = new EventEmitter<void>();

  // @HostListener('document:click', ['$event'])
  // clickout(event:PointerEvent) {
  //   if(this.ref.nativeElement.contains(event.target)) {
  //     this.onClosed.emit();
  //   }
  // }

  $mouseEvent = castTo<MouseEvent>();

  constructor(private ref: ElementRef,
              private transloco: TranslocoService) {
  }
}
