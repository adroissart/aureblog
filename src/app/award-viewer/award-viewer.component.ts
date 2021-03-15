import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-award-viewer',
  templateUrl: './award-viewer.component.html',
  styleUrls: ['./award-viewer.component.scss']
})
export class AwardViewerComponent implements OnInit {

  @Input()
  awards: string[];

  constructor() { }

  ngOnInit() {
//    console.log('AwardComponent::ngOnInit: start');
  }
  getImage(award: string) {
    return "assets/images/" + award.replace(/,/g, '') + ".jpg";
  }
}
