import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmCustomersComponent } from './abm-customers.component';

describe('AbmCustomersComponent', () => {
  let component: AbmCustomersComponent;
  let fixture: ComponentFixture<AbmCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbmCustomersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbmCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
