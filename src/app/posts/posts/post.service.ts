import { Injectable } from '@angular/core';
import { Post } from './post';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Injectable()
export class PostService {
    private postsUrl = '/api/posts';

    constructor (private http: HttpClient) {}

    // get("/api/posts")
    getPosts(): Promise<void | Post[]> {
      return this.http.get<Post[]>(this.postsUrl)
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
    deletePost(delpostId: String): Promise<void | String> {
      return this.http.delete<String>(this.postsUrl + '/' + delpostId)
                 .toPromise()
                 .catch(this.handleError);
    }

    // put("/api/posts/:id")
    updatePost(putpost: Post): Promise<void | Post> {
      var putUrl = this.postsUrl + '/' + putpost._id;
      return this.http.put<Post>(putUrl, putpost)
                 .toPromise()
                 .catch(this.handleError);
    }

    private handleError (error: any) {
      let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      if (error.status == 401) {
        console.log("PostService::handleError: no authentication");
      }
      //console.error(errMsg); // log to console instead
      return errMsg;
    }
}