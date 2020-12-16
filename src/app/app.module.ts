import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PostDetailsComponent } from './posts/posts/post-details/post-details.component';
import { PostDetailsNoEditComponent } from './posts/posts/post-details-noedit/post-details-noedit.component';
import { PostListComponent } from './posts/posts/post-list/post-list.component';
import { LoginComponent } from './login/login.component';
import { RatingViewerComponent } from './rating-viewer/rating-viewer.component';
import { FilterComponent } from './posts/filter/filter.component';
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    PostDetailsComponent,
    PostDetailsNoEditComponent,
    PostListComponent,
    LoginComponent,
    RatingViewerComponent,
    FilterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    TagInputModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
