import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-rating-viewer',
  templateUrl: './rating-viewer.component.html',
  styleUrls: ['./rating-viewer.component.scss']
})
export class RatingViewerComponent implements OnInit {

  @Input()
  rating: number;

  constructor() { }

  ngOnInit() {
    console.log('LoginComponent::ngOnInit: start');
  }

}
