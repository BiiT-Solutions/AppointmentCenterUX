import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuthComponent } from './ms-auth.component';

describe('MsAuthComponent', () => {
  let component: MsAuthComponent;
  let fixture: ComponentFixture<MsAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
