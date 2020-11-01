import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../post';
import { PostService } from '../post.service';
import { PostDetailsComponent } from '../post-details/post-details.component';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  providers: [PostService]
})

export class PostListComponent implements OnInit {

  posts: Post[]
  selectedPost: Post
  isLoggedIn : boolean = false;

  constructor(private authService : AuthService, private postService: PostService) { }

  ngOnInit() {
     console.log("PostListComponent::ngOnInit: start")
     this.authService.currentUserData.subscribe((message : string) => this.handleLoginEvent(message))
  }

  private errorhandling(error) {
    
  }

  handleLoginEvent(message: string) {
    let newIsLoggedIn = (message !== '')
    console.log("PostListComponent::handleLoginEvent: message is ["+message+"] current isLoggedIn["+this.isLoggedIn+"] new isLoggedIn["+newIsLoggedIn+"]")
    if (newIsLoggedIn !== this.isLoggedIn) {
      this.isLoggedIn = newIsLoggedIn
      this.reloadPosts()
    } 
  }

  reloadPosts() {
    this.postService
    .getPosts()
    .then((posts: Post[]) => {
      if (Array.isArray(posts)) {
        this.posts = posts.map((post) => {
          return post;
        });
      } else {
        console.log("PostListComponent::reloadPosts: no post")
        this.posts =[]
      }
    });
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
      content: '',
      rating: 1
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
    console.log("idx is "+idx);
    if (idx !== -1) {
      this.posts[idx] = post;
    }
    this.selectPost(null);
    return this.posts;
  }

  onLogin(){
    console.log("onlogin");
    this.createNewPost();
  }

  unselectPost(){
    this.selectPost(null);
  }
}