import { TestBed } from '@angular/core/testing';

import { GoldRateService } from './gold-rate.service';

describe('GoldRateService', () => {
  let service: GoldRateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoldRateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
