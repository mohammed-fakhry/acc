import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToStockPermissionComponent } from './add-to-stock-permission.component';

describe('AddToStockPermissionComponent', () => {
  let component: AddToStockPermissionComponent;
  let fixture: ComponentFixture<AddToStockPermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddToStockPermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToStockPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
