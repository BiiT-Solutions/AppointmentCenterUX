import {Component, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {provideTranslocoScope, TranslocoService} from "@ngneat/transloco";
import {CalendarEvent, castTo} from "biit-ui/calendar";
import {User} from "authorization-services-lib";
import {Permission} from "../../../config/rbac/permission";

@Component({
  selector: 'event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
  providers: [provideTranslocoScope({scope: 'components/forms', alias: 'form'})],
  host: {
    '(document:pointerdown)': 'clickout($event)'
  }
})
export class EventCardComponent {
  @Input() event: CalendarEvent;
  @Input() organizationUsers: User[];
  @Input() subscribed: boolean = false;
  @Output() onEdit: EventEmitter<CalendarEvent> = new EventEmitter<CalendarEvent>();
  @Output() onClosed: EventEmitter<void> = new EventEmitter<void>();
  @Output() onSubscribe: EventEmitter<void> = new EventEmitter<void>();
  @Output() onUnsubscribe: EventEmitter<void> = new EventEmitter<void>();

  @HostListener('document:window', ['$event'])
  clickout(event: MouseEvent | PointerEvent) {
    if(!this.ref.nativeElement.contains(event.target)) {
      this.onClosed.emit();
    }
  }

  protected readonly Permission = Permission;
  $mouseEvent = castTo<MouseEvent>();

  constructor(private ref: ElementRef,
              private transloco: TranslocoService) {
  }
}
