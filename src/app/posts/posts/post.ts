export class Post {
    _id?: string;
    title: string;
    date: string;
    content: string;
    rating: number;
    imageurl: string;
    directors: [string];
    awards: [string];
    year: number;
    tags: [string];
}
