export class Trip {
    _id?: string;
    title: string;
    date: string;
    summary: string;
    imageurl: string;
    country: [string];
    steps: [{ 
        title: string;
        imageurl: string;
        body: string; 
        date: string;
        longitude: string;
        latitude: string;
        accomodation: string;
        duration: string; 
    }];
}
