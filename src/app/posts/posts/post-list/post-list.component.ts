import { Component, OnInit } from '@angular/core';
import { Post } from '../post';
import { PostService } from '../post.service';
import { PostDetailsComponent } from '../post-details/post-details.component';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  providers: [PostService]
})

export class PostListComponent implements OnInit {

  posts: Post[]
  selectedPost: Post

  constructor(private postService: PostService) { }

  ngOnInit() {
     console.log("post list is initializing")
     this.postService
      .getPosts()
      .then((posts: Post[]) => {
        if (Array.isArray(posts)) {
          this.posts = posts.map((post) => {
            return post;
          });
        }
      });
  }

  private errorhandling(error) {
    
  }

  private getIndexOfPost = (postId: String) => {
    console.log("to delete post id is :"+postId)
    return this.posts.findIndex((post) => {
      console.log("post id is :"+post._id);
      return post._id === postId;
    });
  }

  selectPost(post: Post) {
    this.selectedPost = post
  }

  createNewPost() {
    var post: Post = {
      title: '',
      date: '',
      content: ''
    };

    // By default, a newly-created contact will have the selected state.
    this.selectPost(post);
  }

  deletePost = (postId: String) => {
    console.log("deletePost is called with id: "+postId);
    var idx = this.getIndexOfPost(postId);
    console.log("idx is "+idx);
    if (idx !== -1) {
      console.log("splicing");
      this.posts.splice(idx, 1);
      this.selectPost(null);
    }
    return this.posts;
  }

  addPost = (post: Post) => {
    this.posts.push(post);
    this.selectPost(post);
    return this.posts;
  }

  updatePost = (post: Post) => {
    var idx = this.getIndexOfPost(post._id);
    if (idx !== -1) {
      this.posts[idx] = post;
      this.selectPost(post);
    }
    return this.posts;
  }

  onLogin(){
    console.log("onlogin");
    this.createNewPost();
  }
}