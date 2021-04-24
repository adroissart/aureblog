import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Trip } from './trip';
import { TripService, TripWithPages } from './trip.service';

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.scss'],
  providers: [TripService]
})
export class TripListComponent implements OnInit {

  trips: Trip[];
  nbPages = 1;
  currentPage = 1;

  constructor(private authService: AuthService, private tripService: TripService) { }

  ngOnInit(): void {
    this.reloadTrips();
  }

  reloadTrips(page: number = 0) {
    console.log('reloadPosts for page ' + page);
    this.tripService
      .getTrips(page + 1,'', '', '')
      .then((tripWithPages: TripWithPages) => {
        if (Array.isArray(tripWithPages.trips)) {
          this.trips = tripWithPages.trips.map((trip) => {
            return trip;
          });
          this.nbPages = tripWithPages.nbPages;
          this.currentPage = tripWithPages.currentPage;
        } else {
          console.log('TripListComponent::reloadTrips: no trip');
          this.trips = [];
          this.nbPages = 0;
          this.currentPage = 0;
        }
      });
  }

}
