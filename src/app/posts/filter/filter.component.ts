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
  Data: Array<any> = [
    { name: '1', value: '1' },
    { name: '2', value: '2' },
    { name: '3', value: '3' },
    { name: '4', value: '4' },
    { name: '5', value: '5' }
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      checkArray: this.fb.array([])
    });
  }

  ngOnInit() {
    console.log('FilterComponent::ngOnInit: start');
  }

  onCheckboxChange(e) {
    const checkArray: FormArray = this.form.get('checkArray') as FormArray;

    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value === e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  applyFilter() {
    console.log('apply filter' + this.startDate.toString() + this.endDate.toString() + this.ratings.toString() + this.partialTitle);
    this.filterRequested.emit({ startDate: this.startDate, endDate: this.endDate, ratings: this.ratings, partialTitle: this.partialTitle });
  }

}
