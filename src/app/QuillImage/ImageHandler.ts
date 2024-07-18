import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import QuillImageDropAndPaste, { ImageData as QuillImageData } from 'quill-image-drop-and-paste'

interface IImageMeta {
  type: string;
  dataUrl: string;
  blobUrl: SafeUrl;
  file: File | null;
}

class imageHandler {


  constructor(private sanitizer: DomSanitizer) {}
  image: IImageMeta = {
    type: '',
    dataUrl: '',
    blobUrl: '',
    file: null,
  };


  imageHandler(dataUrl: string, type: string, imageData: QuillImageData) {
    imageData
      .minify({
        maxWidth: 320,
        maxHeight: 320,
        quality: 0.7,
      })
      .then((miniImageData) => {
        if (miniImageData instanceof QuillImageData) {
          const blob = miniImageData.toBlob();
          const file = miniImageData.toFile();

          console.log(`type: ${type}`);
          console.log(`dataUrl: ${dataUrl}`);
          console.log(`blob: ${blob}`);
          console.log(`file: ${file}`);

          this.image = {
            type,
            dataUrl,
            blobUrl: this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob)),
            file,
          };
        }
      });
  }
}


export default imageHandler
