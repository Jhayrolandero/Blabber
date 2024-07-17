import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import Quill from 'quill';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideQuillConfig } from 'ngx-quill';
import { loggingInterceptor } from './services/auth.interceptor';
import BlotFormatter from 'quill-blot-formatter';
import CustomImage from './QuillImage/ImageAlignment';

// This is for image resizer
Quill.register('modules/blotFormatter', BlotFormatter)

// Enable the image alignment to be save
Quill.register({
 'formats/image': CustomImage
});

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
      ]
          }
    })]
};
