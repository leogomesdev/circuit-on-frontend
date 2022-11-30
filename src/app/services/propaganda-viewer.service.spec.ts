import { TestBed } from '@angular/core/testing';

import { PropagandaViewerService } from './propaganda-viewer.service';

describe('PropagandaViewerService', () => {
  let service: PropagandaViewerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropagandaViewerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
