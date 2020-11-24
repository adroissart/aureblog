import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../post';
import { PostService, PostWithPages } from '../post.service';
import { RatingViewerComponent } from '../../../rating-viewer/rating-viewer.component';
import { PostDetailsComponent } from '../post-details/post-details.component';
import { PostDetailsNoEditComponent } from '../post-details-noedit/post-details-noedit.component';
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
  isEdit = false;
  // filters
  filterStartDate = '1900-01-01';
  filterEndDate = '9999-12-31';
  filterRatings = [1, 2, 3, 4, 5];
  partialTitle = '';

  constructor(private authService: AuthService, private postService: PostService) { }

  ngOnInit() {
    console.log('PostListComponent::ngOnInit: start');
    this.authService.currentUserData.subscribe((message: string) => this.handleLoginEvent(message));
  }

  private errorhandling(error) {
  }

  handleLoginEvent(message: string) {
    console.log('postlistcomponent::handleloginevent : message is ' + message);
    const newUser: NiceUser = JSON.parse(message);
    const newIsLoggedIn = newUser.username ? (newUser.username !== '') : false;
    console.log('postlistcomponent::handleloginevent : newuser is ' + newUser.username);
    this.isEdit = newUser.admin;
    console.log('PostListComponent::handleLoginEvent: message is [' + message + ']'
      + 'current isLoggedIn[' + this.isLoggedIn + '] new isLoggedIn[' + newIsLoggedIn + ']');
    if (newIsLoggedIn !== this.isLoggedIn) {
      this.isLoggedIn = newIsLoggedIn;
      this.reloadPosts();
    }
  }

  filterPosts(filterCriteria: any) {
    console.log('filterStartDate is ' + filterCriteria.startDate + ' filterEndDate is '
      + filterCriteria.endDate + ' filterRatings is ' + filterCriteria.ratings + ' partialTitle is ' + filterCriteria.partialTitle);
    this.filterStartDate = filterCriteria.startDate;
    this.filterEndDate = filterCriteria.endDate;
    this.filterRatings = filterCriteria.ratings;
    this.partialTitle = filterCriteria.partialTitle;
    this.reloadPosts();
  }

  reloadPosts(page: number = 0) {
    console.log('reloadPosts for page ' + page);
    this.postService
      .getPosts(page + 1, this.filterStartDate, this.filterEndDate, this.filterRatings, this.partialTitle)
      .then((postWithPages: PostWithPages) => {
        if (Array.isArray(postWithPages.posts)) {
          this.posts = postWithPages.posts.map((post) => {
            return post;
          });
          this.nbPages = postWithPages.nbPages;
          this.currentPage = postWithPages.currentPage;
        } else {
          console.log('PostListComponent::reloadPosts: no post');
          this.posts = [];
          this.nbPages = 0;
          this.currentPage = 0;
        }
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
      imageurl: '...',
      year: 0,
      directors: [''],
      awards: [''],
      tags: ['']
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

  hello() {
    console.log('hello');
  }


}
