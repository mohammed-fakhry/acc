import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSafeComponent } from './add-safe.component';

describe('AddSafeComponent', () => {
  let component: AddSafeComponent;
  let fixture: ComponentFixture<AddSafeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSafeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSafeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
