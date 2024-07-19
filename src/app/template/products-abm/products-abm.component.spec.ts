import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsABMComponent } from './products-abm.component';

describe('ProductsABMComponent', () => {
  let component: ProductsABMComponent;
  let fixture: ComponentFixture<ProductsABMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsABMComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductsABMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
