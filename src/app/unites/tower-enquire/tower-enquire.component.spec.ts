import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TowerEnquireComponent } from './tower-enquire.component';

describe('TowerEnquireComponent', () => {
  let component: TowerEnquireComponent;
  let fixture: ComponentFixture<TowerEnquireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TowerEnquireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TowerEnquireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
