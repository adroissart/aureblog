import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../post';
import { PostService, PostWithPages } from '../post.service';
import { PostDetailsComponent } from '../post-details/post-details.component';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  providers: [PostService]
})

export class PostListComponent implements OnInit {

  posts: Post[];
  selectedPost: Post;
  isLoggedIn = false;
  nbPages = 1;
  currentPage = 1;

  constructor(private authService: AuthService, private postService: PostService) { }

  ngOnInit() {
    console.log('PostListComponent::ngOnInit: start');
    this.authService.currentUserData.subscribe((message: string) => this.handleLoginEvent(message));
  }
  // utilities
  incrementMe(input: number) {
    return input++;
  }

  private errorhandling(error) {
  }

  handleLoginEvent(message: string) {
    const newIsLoggedIn = (message !== '');
    console.log('PostListComponent::handleLoginEvent: message is [' + message + ']'
      + 'current isLoggedIn[' + this.isLoggedIn + '] new isLoggedIn[' + newIsLoggedIn + ']');
    if (newIsLoggedIn !== this.isLoggedIn) {
      this.isLoggedIn = newIsLoggedIn;
      this.reloadPosts();
    }
  }

  reloadPosts(page = 0) {
    page++;
    this.postService
      .getPosts(page)
      .then((postWithPages: PostWithPages) => {
        if (Array.isArray(postWithPages.posts)) {
          this.posts = postWithPages.posts.map((post) => {
            return post;
          });
        } else {
          console.log('PostListComponent::reloadPosts: no post');
          this.posts = [];
        }
        this.nbPages = postWithPages.nbPages;
        this.currentPage = postWithPages.currentPage.valueOf();
      });
  }

  private getIndexOfPost = (postId: string) => {
    console.log('to delete post id is :' + postId);
    return this.posts.findIndex((post) => {
      console.log('post id is :' + post._id);
      return post._id === postId;
    });
  }

  selectPost(post: Post) {
    this.selectedPost = post;
  }

  createNewPost() {
    const post: Post = {
      title: '',
      date: '',
      content: '',
      rating: 1,
      imageurl: '...' //"http://fr.web.img5.acsta.net/r_160_240/b_1_d6d6d6/medias/nmedia/18/66/01/66/20217856.jpg"
    };

    // By default, a newly-created contact will have the selected state.
    this.selectPost(post);
  }

  deletePost = (postId: string) => {
    console.log('deletePost is called with id: ' + postId);
    const idx = this.getIndexOfPost(postId);
    console.log('idx is ' + idx);
    if (idx !== -1) {
      console.log('splicing');
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
    const idx = this.getIndexOfPost(post._id);
    console.log('idx is ' + idx);
    if (idx !== -1) {
      this.posts[idx] = post;
    }
    this.selectPost(null);
    return this.posts;
  }

  onLogin() {
    console.log('onlogin');
    this.createNewPost();
  }

  unselectPost() {
    this.selectPost(null);
  }


}
