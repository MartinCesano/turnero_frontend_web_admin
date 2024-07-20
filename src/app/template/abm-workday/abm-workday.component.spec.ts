import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmWorkdayComponent } from './abm-workday.component';

describe('AbmWorkdayComponent', () => {
  let component: AbmWorkdayComponent;
  let fixture: ComponentFixture<AbmWorkdayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbmWorkdayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AbmWorkdayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
