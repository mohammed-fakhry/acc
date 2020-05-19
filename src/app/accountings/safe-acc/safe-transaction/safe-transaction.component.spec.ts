import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeTransactionComponent } from './safe-transaction.component';

describe('SafeTransactionComponent', () => {
  let component: SafeTransactionComponent;
  let fixture: ComponentFixture<SafeTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SafeTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
