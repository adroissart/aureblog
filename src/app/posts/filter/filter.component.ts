import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Output() filterRequested = new EventEmitter<{ startDate: string, endDate: string, ratings: string[], partialTitle: string, director: string, award: string, reinitEnabled: boolean }>();
  @Input() startDate: string;
  @Input() endDate: string;
  @Input() ratings: string[];
  @Input() partialTitle: string;
  @Input() director: string;
  @Input() award: string;
  @Input() reinitEnabled: boolean;
  form: FormGroup;
  toto = [
    { id: 0, name: 'unrated' },
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: 3, name: '3' },
    { id: 4, name: '4' },
    { id: 5, name: '5' }
  ];
  filterLabels = ['bibi','baba'];
  

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      ratings: new FormArray([])
    });
    this.addCheckboxes();
    this.reinitEnabled = false;
  }

  ngOnInit() {
    this.filterLabels = this.getFilterLabels();
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
    this.reinitEnabled = true;
    this.filterRequested.emit({ startDate: this.startDate, endDate: this.endDate, ratings: this.ratings, partialTitle: this.partialTitle, director: this.director, award: this.award, reinitEnabled: this.reinitEnabled });
    this.filterLabels = this.getFilterLabels();
  }

  reinit() {
    console.log('reinit filters');
    this.startDate = '1900-01-01';
    this.endDate = '9990-12-31';
    this.ratings = ['1', '2', '3', '4', '5'];
    let counter=0;
    this.ratingsFormArray.controls.forEach(element => {
      element.setValue(counter!=0);
      counter++;
    });
    this.partialTitle = '';
    this.director = '';
    this.award = '';
    this.reinitEnabled = false;
    this.filterRequested.emit({ startDate: this.startDate, endDate: this.endDate, ratings: this.ratings, partialTitle: this.partialTitle, director: this.director, award: this.award, reinitEnabled: this.reinitEnabled });
    this.filterLabels = this.getFilterLabels();
  }

  getFilterLabels() {
    let labels = []
    if (this.partialTitle !== '') {
      labels.push('title like '+this.partialTitle);
    }
    labels.push('viewed from '+this.startDate+' to '+this.endDate);
    labels.push('ratings '+this.ratings);
    if (this.director !== '') {
      labels.push('directed by '+this.director);
    }
    if (this.award !== '') {
      labels.push('awarded at '+this.award);
    }
    return labels;
  }

}
