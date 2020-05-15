import { TestBed } from '@angular/core/testing';

import { SafeDataService } from './safe-data.service';

describe('SafeDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SafeDataService = TestBed.get(SafeDataService);
    expect(service).toBeTruthy();
  });
});
