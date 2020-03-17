import { TestBed } from '@angular/core/testing';

import { SideEffectService } from './side-effect.service';

describe('SideEffectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SideEffectService = TestBed.get(SideEffectService);
    expect(service).toBeTruthy();
  });
});
