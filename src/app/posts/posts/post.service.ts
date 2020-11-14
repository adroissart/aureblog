import { Injectable } from '@angular/core';
import { Post } from './post';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';

const LIMIT = 2;
export interface PostWithPages {
  posts: Post[];
  nbPages: number;
  currentPage: number;
}

@Injectable()
export class PostService {
  private postsUrl = '/api/posts';

  constructor(private http: HttpClient) { }

  // get("/api/posts")
  getPosts(page = 1): Promise<void | PostWithPages> {
    const options = { params: new HttpParams().set('limit', LIMIT.toString()).set('page', page.toString()) };
    return this.http.get<PostWithPages>(this.postsUrl, options)
      .toPromise()
      .catch(this.handleError);
  }

  // post("/api/posts")
  createPost(newpost: Post): Promise<void | Post> {
    return this.http.post<Post>(this.postsUrl, newpost)
      .toPromise()
      .catch(this.handleError);
  }

  // get("/api/posts/:id") endpoint not used by Angular app
  // delete("/api/posts/:id")
  deletePost(delpostId: string): Promise<void | string> {
    return this.http.delete<string>(this.postsUrl + '/' + delpostId)
      .toPromise()
      .catch(this.handleError);
  }

  // put("/api/posts/:id")
  updatePost(putpost: Post): Promise<void | Post> {
    const putUrl = this.postsUrl + '/' + putpost._id;
    return this.http.put<Post>(putUrl, putpost)
      .toPromise()
      .catch(this.handleError);
  }

  private handleError(error: any) {
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    if (error.status === 401) {
      console.log('PostService::handleError: no authentication');
    }
    // console.error(errMsg); // log to console instead
    return errMsg;
  }
}
