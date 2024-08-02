import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmReservationComponent } from './abm-reservation.component';

describe('AbmReservationComponent', () => {
  let component: AbmReservationComponent;
  let fixture: ComponentFixture<AbmReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbmReservationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbmReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
