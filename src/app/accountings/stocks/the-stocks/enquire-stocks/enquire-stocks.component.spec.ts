import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquireStocksComponent } from './enquire-stocks.component';

describe('EnquireStocksComponent', () => {
  let component: EnquireStocksComponent;
  let fixture: ComponentFixture<EnquireStocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnquireStocksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnquireStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
