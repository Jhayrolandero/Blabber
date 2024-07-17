import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContentextractService {

  constructor() { }



  extractContent(content: string) {
    // Create a new DOMParser instance
    let parser = new DOMParser();

    // Parse the HTML string into a Document object
    let doc = parser.parseFromString(content, 'text/html');

    // Select the first image element
    let firstImage = doc.querySelector('img');

    // Extract the src attribute of the first image
    let firstImageSrc = firstImage ? firstImage.src : null;
    // Remove all image elements from the document
    let images = doc.querySelectorAll('img');
    images.forEach(img => img.remove());

    // Extract the text content
    let textContent = doc.body.textContent;

    return {textContent, firstImageSrc}
    // console.log(textContent);
  }
}
