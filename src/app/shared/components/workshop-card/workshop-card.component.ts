import {Component, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {provideTranslocoScope, TranslocoService} from "@ngneat/transloco";
import {CalendarEvent, castTo} from "biit-ui/calendar";
import {Permission} from "../../../config/rbac/permission";
import {AppointmentTemplate} from "appointment-center-structure-lib";

@Component({
  selector: 'workshop-card',
  templateUrl: './workshop-card.component.html',
  styleUrls: ['./workshop-card.component.scss'],
  providers: [provideTranslocoScope({scope: 'components/forms', alias: 'form'})],
  host: {
    '(document:pointerdown)': 'clickout($event)'
  }
})
export class WorkshopCardComponent {
  @Input() workshop: AppointmentTemplate;
  @Input() speakersLabel: string = "";
  @Input() subscribedEvents: CalendarEvent[] = [];
  @Output() onNextDate: EventEmitter<Date> = new EventEmitter<Date>();
  @Output() onClosed: EventEmitter<void> = new EventEmitter<void>();

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
