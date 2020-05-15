import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeAccComponent } from './safe-acc.component';

describe('SafeAccComponent', () => {
  let component: SafeAccComponent;
  let fixture: ComponentFixture<SafeAccComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SafeAccComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeAccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
