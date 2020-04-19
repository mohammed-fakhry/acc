import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerInvDetailComponent } from './customer-inv-detail.component';

describe('CustomerInvDetailComponent', () => {
  let component: CustomerInvDetailComponent;
  let fixture: ComponentFixture<CustomerInvDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerInvDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerInvDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
