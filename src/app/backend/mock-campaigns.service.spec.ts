import { TestBed } from '@angular/core/testing';

import { MockCampaignsService } from './mock-campaigns.service';

describe('MockCampaignsService', () => {
  let service: MockCampaignsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockCampaignsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
