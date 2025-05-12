import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalCalendarFormComponent } from './external-calendar-form.component';

describe('ExternalCalendarFormComponent', () => {
  let component: ExternalCalendarFormComponent;
  let fixture: ComponentFixture<ExternalCalendarFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalCalendarFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalCalendarFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
