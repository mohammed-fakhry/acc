import { TestBed } from '@angular/core/testing';

import { TowerDataService } from './tower-data.service';

describe('TowerDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TowerDataService = TestBed.get(TowerDataService);
    expect(service).toBeTruthy();
  });
});
