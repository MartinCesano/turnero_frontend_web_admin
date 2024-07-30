import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyScheduleComponent } from './apply-schedule.component';

describe('ApplyScheduleComponent', () => {
  let component: ApplyScheduleComponent;
  let fixture: ComponentFixture<ApplyScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplyScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
