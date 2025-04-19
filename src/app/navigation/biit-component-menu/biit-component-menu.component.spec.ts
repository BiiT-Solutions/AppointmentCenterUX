import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiitComponentMenuComponent } from './biit-component-menu.component';

describe('BiitComponentMenuComponent', () => {
  let component: BiitComponentMenuComponent;
  let fixture: ComponentFixture<BiitComponentMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiitComponentMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiitComponentMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
