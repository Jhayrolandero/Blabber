import { TestBed } from '@angular/core/testing';

import { ContentextractService } from './contentextract.service';

describe('ContentextractService', () => {
  let service: ContentextractService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentextractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
