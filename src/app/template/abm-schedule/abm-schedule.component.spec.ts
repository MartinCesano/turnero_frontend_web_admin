import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmScheduleComponent } from './abm-schedule.component';

describe('AbmScheduleComponent', () => {
  let component: AbmScheduleComponent;
  let fixture: ComponentFixture<AbmScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbmScheduleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AbmScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
