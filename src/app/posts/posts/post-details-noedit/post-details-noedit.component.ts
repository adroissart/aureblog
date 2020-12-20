import { Component, Input } from '@angular/core';
import { Post } from '../post';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-details-noedit',
  templateUrl: './post-details-noedit.component.html',
  styleUrls: ['./post-details-noedit.component.scss']
})

export class PostDetailsNoEditComponent {
  @Input()
  post: Post;

  @Input()
  selectDirector: Function;

  constructor(private postService: PostService) { }

  doDirector() {
    console.log("select director in post details");
    this.selectDirector(this.post.directors[0]);
  }
}
