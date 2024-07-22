import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PORT } from '../environment/environment';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) {}

   //CRUD requests
  fetchData<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(PORT + '/BlabberAPI/API/' + endpoint);
  }

  postData<T>(data: FormData, endpoint: string): Observable<T> {
    return this.http.post<T>(PORT + '/BlabberAPI/API/' + endpoint, data);
  }

  deleteData(endpoint: string) {
    return this.http.delete<any>(PORT + '/BlabberAPI/API/' + endpoint);
  }

  putData(endpoint: string, data: FormGroup) {
    return this.http.put<any>(PORT + '/BlabberAPI/API/' + endpoint, data.getRawValue());
  }

}
