import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeReceiptComponent } from './safe-receipt.component';

describe('SafeReceiptComponent', () => {
  let component: SafeReceiptComponent;
  let fixture: ComponentFixture<SafeReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SafeReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
