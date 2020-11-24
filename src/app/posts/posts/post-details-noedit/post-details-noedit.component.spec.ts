import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDetailsNoEditComponent } from './post-details-noedit.component';

describe('PostDetailsNoEditComponent', () => {
  let component: PostDetailsNoEditComponent;
  let fixture: ComponentFixture<PostDetailsNoEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PostDetailsNoEditComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostDetailsNoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
