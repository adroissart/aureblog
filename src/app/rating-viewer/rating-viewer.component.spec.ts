import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingViewerComponent } from './rating-viewer.component';

describe('RatingViewerComponent', () => {
  let component: RatingViewerComponent;
  let fixture: ComponentFixture<RatingViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RatingViewerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
