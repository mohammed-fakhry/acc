import { TestBed } from '@angular/core/testing';

import { ClientPaymentService } from './client-payment.service';

describe('ClientPaymentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClientPaymentService = TestBed.get(ClientPaymentService);
    expect(service).toBeTruthy();
  });
});
