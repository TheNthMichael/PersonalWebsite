import { TestBed } from '@angular/core/testing';

import { GitprojectsService } from './gitprojects.service';

describe('GitprojectsService', () => {
  let service: GitprojectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GitprojectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
