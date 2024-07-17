import { TestBed } from '@angular/core/testing';

import { TranslatetagService } from './translatetag.service';

describe('TranslatetagService', () => {
  let service: TranslatetagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslatetagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
