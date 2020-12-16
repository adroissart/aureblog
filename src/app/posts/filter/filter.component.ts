import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Output() filterRequested = new EventEmitter<{ startDate: string, endDate: string, ratings: [string], partialTitle: string }>();
  @Input() startDate: string;
  @Input() endDate: string;
  @Input() ratings: [string];
  @Input() partialTitle: string;
  form: FormGroup;
  toto = [
    { id: 0, name: 'unrated' },
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: 3, name: '3' },
    { id: 4, name: '4' },
    { id: 5, name: '5' }
  ];

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      ratings: new FormArray([])
    });
    this.addCheckboxes();
  }

  ngOnInit() {
    console.log('FilterComponent::ngOnInit: start');
  }

  get ratingsFormArray() {
    return this.form.controls.ratings as FormArray;
  }

  addCheckboxes() {
    this.toto.forEach((item) => this.ratingsFormArray.push(new FormControl(item.id != 0)));
  }


  applyFilter() {
    console.log('apply filter' + this.startDate.toString() + this.endDate.toString() + this.ratings.toString() + this.partialTitle);
    this.ratings = this.form.value.ratings
      .map((checked, i) => checked ? this.toto[i].id : null)
      .filter(v => v !== null);
    this.filterRequested.emit({ startDate: this.startDate, endDate: this.endDate, ratings: this.ratings, partialTitle: this.partialTitle });
  }

}
