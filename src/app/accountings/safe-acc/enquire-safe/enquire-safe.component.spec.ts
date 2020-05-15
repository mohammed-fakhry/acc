import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquireSafeComponent } from './enquire-safe.component';

describe('EnquireSafeComponent', () => {
  let component: EnquireSafeComponent;
  let fixture: ComponentFixture<EnquireSafeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnquireSafeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnquireSafeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
