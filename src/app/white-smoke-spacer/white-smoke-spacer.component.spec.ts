import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhiteSmokeSpacerComponent } from './white-smoke-spacer.component';

describe('WhiteSmokeSpacerComponent', () => {
  let component: WhiteSmokeSpacerComponent;
  let fixture: ComponentFixture<WhiteSmokeSpacerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhiteSmokeSpacerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhiteSmokeSpacerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
