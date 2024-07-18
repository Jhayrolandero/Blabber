import { ApplicationConfig, inject } from '@angular/core';
import { provideRouter } from '@angular/router';

import Quill from 'quill';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideQuillConfig } from 'ngx-quill';
import { loggingInterceptor } from './services/auth.interceptor';
import BlotFormatter from 'quill-blot-formatter';
import CustomImage from './QuillImage/ImageAlignment';
// import { ImageDrop } from 'quill-image-drop-module';
import QuillImageDropAndPaste, { ImageData as QuillImageData } from 'quill-image-drop-and-paste'
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import imageHandler from './QuillImage/ImageHandler';

interface IImageMeta {
  type: string;
  dataUrl: string;
  blobUrl: SafeUrl;
  file: File | null;
}
// This is for image resizer
Quill.register('modules/blotFormatter', BlotFormatter)
// Drag n Drop
Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste)

// Enable the image alignment to be save
Quill.register({
 'formats/image': CustomImage
});

// const sanitizer = new DomSanitizer
// const sanitizer = inject(DomSanitizer)

// function imageHandler(dataUrl: string, type: string, imageData: QuillImageData) {
//   imageData
//     .minify({
//       maxWidth: 320,
//       maxHeight: 320,
//       quality: 0.7,
//     })
//     .then((miniImageData) => {
//       if (miniImageData instanceof QuillImageData) {
//         const blob = miniImageData.toBlob();
//         const file = miniImageData.toFile();

//         console.log(`type: ${type}`);
//         console.log(`dataUrl: ${dataUrl}`);
//         console.log(`blob: ${blob}`);
//         console.log(`file: ${file}`);

//         image = {
//           type,
//           dataUrl,
//           blobUrl: sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob)),
//           file,
//         };
//       }
//     });
// }


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([loggingInterceptor])),
    provideQuillConfig({
      modules: {
        blotFormatter: {
          overlay: {
            style: {
              border: '1px solid white',
            }
          }
        },
        syntax: true,
        toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean'],                                         // remove formatting button

        ['link', 'image', 'video']
      ],
      imageDropAndPaste: {
        handler: imageHandler.bind(this),
      },
          }
    })]
};
