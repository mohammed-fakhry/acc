import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StocTrancePremComponent } from './stoc-trance-prem.component';

describe('StocTrancePremComponent', () => {
  let component: StocTrancePremComponent;
  let fixture: ComponentFixture<StocTrancePremComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StocTrancePremComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StocTrancePremComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
