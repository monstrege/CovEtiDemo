import { TestBed, inject } from '@angular/core/testing';

import { CoveoConnectorService } from './coveo-connector.service';

describe('CoveoConnectorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoveoConnectorService]
    });
  });

  it('should be created', inject([CoveoConnectorService], (service: CoveoConnectorService) => {
    expect(service).toBeTruthy();
  }));
});
