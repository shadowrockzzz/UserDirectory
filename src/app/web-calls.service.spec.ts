import { TestBed } from '@angular/core/testing';

import { WebCallsService } from './web-calls.service';

describe('WebCallsService', () => {
  let service: WebCallsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebCallsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
