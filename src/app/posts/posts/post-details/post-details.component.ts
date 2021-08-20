import { Component, Input } from '@angular/core';
import { Post } from '../post';
import { PostService } from '../post.service';
import { TagInputModule } from 'ngx-chips';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss']
})

export class PostDetailsComponent {
  @Input()
  post: Post;

  @Input()
  createHandler: Function;
  @Input()
  updateHandler: Function;
  @Input()
  deleteHandler: Function;
  @Input()
  cancelHandler: Function;

  constructor(private postService: PostService) { }

  createPost(post: Post) {
    this.postService.createPost(post).then((newPost: Post) => {
      this.createHandler(newPost);
    });
  }

  updatePost(post: Post): void {
    console.log('tags : ' + post.tags);
    this.postService.updatePost(post).then((updatedPost: Post) => {
      this.updateHandler(updatedPost);
    });
  }

  deletePost(postId: string): void {
    this.postService.deletePost(postId).then((deletedPostId: string) => {
      this.deleteHandler(deletedPostId);
    });
  }

  cancelPost(post: Post):void {
    this.cancelHandler(post);
  }
}
