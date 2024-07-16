import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
@Injectable({
  providedIn: 'root'
})
export class FormdataService {

  constructor() { }

  formDatanalize(FormGroup: FormGroup): FormData {
    const formData: FormData = new FormData()

    Object.keys(FormGroup.controls).forEach((key: string) => {
      formData.append(key, FormGroup.get(key)?.value)
    });

    return formData
  }
}
