import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquireClientsComponent } from './enquire-clients.component';

describe('EnquireClientsComponent', () => {
  let component: EnquireClientsComponent;
  let fixture: ComponentFixture<EnquireClientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnquireClientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnquireClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
