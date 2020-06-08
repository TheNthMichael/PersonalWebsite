import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasbackgroundComponent } from './canvasbackground.component';

describe('CanvasbackgroundComponent', () => {
  let component: CanvasbackgroundComponent;
  let fixture: ComponentFixture<CanvasbackgroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasbackgroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasbackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
