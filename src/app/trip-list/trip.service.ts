import { Injectable } from '@angular/core';
import { Trip } from './trip';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';

const LIMIT = 40;
export interface TripWithPages {
  trips: Trip[];
  nbPages: number;
  currentPage: number;
}

@Injectable()
export class TripService {
  private tripsUrl = '/api/trips';

  constructor(private http: HttpClient) { }

  // get("/api/trips")
  getTrips(page = 1, startDate = '', endDate = '', countries = 'France'): Promise<void | TripWithPages> {
    const options = {
      params: new HttpParams().set('limit', LIMIT.toString()).set('page', page.toString())
        .set('startDate', startDate).set('endDate', endDate).set('countries', countries.toString())
    };
    return this.http.get<TripWithPages>(this.tripsUrl, options)
      .toPromise()
      .catch(this.handleError);
  }


  // post("/api/trips")
  createTrip(newtrip: Trip): Promise<void | Trip> {
    return this.http.post<Trip>(this.tripsUrl, newtrip)
      .toPromise()
      .catch(this.handleError);
  }

  // get("/api/trips/:id") endpoint not used by Angular app
  // delete("/api/trips/:id")
  deleteTrip(deltripId: string): Promise<void | string> {
    return this.http.delete<string>(this.tripsUrl + '/' + deltripId)
      .toPromise()
      .catch(this.handleError);
  }

  // put("/api/trips/:id")
  updateTrip(puttrip: Trip): Promise<void | Trip> {
    const putUrl = this.tripsUrl + '/' + puttrip._id;
    return this.http.put<Trip>(putUrl, puttrip)
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
