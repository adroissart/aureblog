import { Component, Input, OnInit, AfterViewChecked, AfterContentChecked, OnChanges } from '@angular/core';
import { Post } from '../post';
import { PostService, PostWithPages } from '../post.service';
import { RatingViewerComponent } from '../../../rating-viewer/rating-viewer.component';
import { AwardViewerComponent } from '../../../award-viewer/award-viewer.component';
import { PostDetailsComponent } from '../post-details/post-details.component';
import { PostDetailsNoEditComponent } from '../post-details-noedit/post-details-noedit.component';
import { AuthService } from '../../../auth.service';
import { ViewportScroller } from '@angular/common';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  providers: [PostService]
})

export class PostListComponent implements OnInit, AfterViewChecked, AfterContentChecked, OnChanges {

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
  filterDirector = '';
  filterAward = '';
  reinitEnabled = false;
  scrollpositionY = 1000;
  scrollpositionX = 0;

  constructor(private authService: AuthService, private postService: PostService, private viewportScroller: ViewportScroller) { }

  ngOnInit() {
    //console.log('PostListComponent::ngOnInit: start');
    this.authService.currentUserData.subscribe((message: string) => this.handleLoginEvent(message));
  }
  ngOnChanges() {
    //console.log('ngOnChanges');
    //this.scrollpositionX = this.viewportScroller.getScrollPosition()[0];
    //this.scrollpositionY = this.viewportScroller.getScrollPosition()[1];
    //console.log("storing position " + this.scrollpositionX + "/" + this.scrollpositionY);
  }
  ngAfterViewChecked() {
    //console.log('ngAfterViewChecked');
  }
  ngAfterContentChecked() {
    //console.log('ngAfterContentChecked');
  }

  private errorhandling(error) {
  }

  postsTrackBy(index: number, post: Post) { return post._id; }

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
      + filterCriteria.endDate + ' filterRatings is ' + filterCriteria.ratings + ' partialTitle is ' + filterCriteria.partialTitle) + ' director is ' + filterCriteria.director;
    this.filterStartDate = filterCriteria.startDate;
    this.filterEndDate = filterCriteria.endDate;
    this.filterRatings = filterCriteria.ratings;
    this.partialTitle = filterCriteria.partialTitle;
    this.filterDirector = filterCriteria.director;
    this.filterAward = filterCriteria.award;
    this.reinitEnabled = filterCriteria.reinitEnabled;
    this.reloadPosts();
  }

  reloadPosts(page: number = 0) {
    console.log('reloadPosts for page ' + page);
    this.scrollpositionX = 0;
    this.scrollpositionY = 0;
    this.postService
      .getPosts(page + 1, this.filterStartDate, this.filterEndDate, this.filterRatings, this.partialTitle, this.filterDirector, this.filterAward)
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
    if (post != null) {
      this.scrollpositionX = this.viewportScroller.getScrollPosition()[0];
      this.scrollpositionY = this.viewportScroller.getScrollPosition()[1];
      console.log("storing position " + this.scrollpositionX + "/" + this.scrollpositionY);
    }
  }

  createNewPost() {
    const post: Post = {
      title: '',
      date: '',
      place: '',
      content: '',
      rating: 0,
      imageurl: '',
      country: '',
      year: 0,
      directors: [] as string[],
      awards: [] as string[],
      tags: [] as string[],
      allocineid: 0
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

  selectDirector = (director: string) => {
    console.log("select director");
    this.filterDirector = director;
    this.reinitEnabled = true;
    this.reloadPosts();
    this.selectPost(null);
  }

  selectAward = (award: string) => {
    console.log("select award");
    this.filterAward = award;
    this.reinitEnabled = true;
    this.reloadPosts();
    this.selectPost(null);
  }

  onLogin() {
    console.log('onlogin');
    this.createNewPost();
  }

  unselectPost() {
    this.selectPost(null);

    setTimeout(() => {
      this.doScroll();
    }, 500);

  }

  public doScroll() {
    console.log("scrolling to " + this.scrollpositionY);
    this.viewportScroller.scrollToPosition([this.scrollpositionX, this.scrollpositionY]);
    this.scrollpositionX = 0;
    this.scrollpositionY = 0;
  }

  hello() {
    console.log('hello');
  }

  getImage(imageurl: string) {
    return imageurl;
  }

  isVisible(input: number, currentPage: number, nbPages: number) {
    if (input === 0) {
      return true;
    }
    if (input === nbPages - 1) {
      return true;
    }
    if ((input > Math.min(currentPage - 6, nbPages - 12)) && (input < Math.max(currentPage + 4, 11))) {
      return true;
    }
    return false;
  }
  isVisiblePointPoint(input: number, currentPage: number, nbPages: number) {
    if ((input === 0) && (currentPage > 6)) {
      return true;
    }
    if ((input === nbPages - 2) && (currentPage < nbPages - 5)) {
      return true;
    }
  }
}
