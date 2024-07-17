import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslatetagService {

  constructor() { }

  getTagNameById(tagID: number): string  {
    const tags = [
      { tagID: 1, tagName: "Education" },
      { tagID: 2, tagName: "Entertainment" },
      { tagID: 3, tagName: "Comedy" },
      { tagID: 4, tagName: "Politics" },
      { tagID: 5, tagName: "Technology" },
      { tagID: 6, tagName: "Food" },
      { tagID: 7, tagName: "Sports" },
      { tagID: 8, tagName: "Meme" },
      { tagID: 9, tagName: "Travel" },
      { tagID: 10, tagName: "Movie" },
      { tagID: 11, tagName: "Fitness" },
      { tagID: 12, tagName: "Other" }
    ];

    const tag = tags.find(t => t.tagID === tagID);
    return tag ? tag.tagName : 'All';
  }
}
