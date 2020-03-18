import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheStocksComponent } from './the-stocks.component';

describe('TheStocksComponent', () => {
  let component: TheStocksComponent;
  let fixture: ComponentFixture<TheStocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheStocksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
