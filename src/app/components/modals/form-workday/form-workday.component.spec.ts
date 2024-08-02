import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormWorkdayComponent } from './form-workday.component';

describe('FormWorkdayComponent', () => {
  let component: FormWorkdayComponent;
  let fixture: ComponentFixture<FormWorkdayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormWorkdayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormWorkdayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
