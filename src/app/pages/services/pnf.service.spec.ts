import { TestBed } from '@angular/core/testing';

import { PnfService } from './pnf.service';

describe('PnfService', () => {
  let service: PnfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PnfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
