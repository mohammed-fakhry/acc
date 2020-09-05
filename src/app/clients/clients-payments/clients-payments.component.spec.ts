import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsPaymentsComponent } from './clients-payments.component';

describe('ClientsPaymentsComponent', () => {
  let component: ClientsPaymentsComponent;
  let fixture: ComponentFixture<ClientsPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientsPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientsPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
