import { TestBed } from '@angular/core/testing';

import { TeachersclassesService } from './teachersclasses.service';

describe('TeachersclassesService', () => {
  let service: TeachersclassesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeachersclassesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
