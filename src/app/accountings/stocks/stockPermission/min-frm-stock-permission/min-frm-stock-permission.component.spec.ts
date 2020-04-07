import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinFrmStockPermissionComponent } from './min-frm-stock-permission.component';

describe('MinFrmStockPermissionComponent', () => {
  let component: MinFrmStockPermissionComponent;
  let fixture: ComponentFixture<MinFrmStockPermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinFrmStockPermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinFrmStockPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
