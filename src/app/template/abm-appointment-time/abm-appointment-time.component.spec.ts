import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmAppointmentTimeComponent } from './abm-appointment-time.component';

describe('AbmAppointmentTimeComponent', () => {
  let component: AbmAppointmentTimeComponent;
  let fixture: ComponentFixture<AbmAppointmentTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbmAppointmentTimeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AbmAppointmentTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
