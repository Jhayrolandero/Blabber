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

  source = 'blog_site_api';
   //CRUD requests
  fetchData<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(PORT + `/${this.source}/API/` + endpoint);
  }

  postData<T>(data: FormData, endpoint: string): Observable<T> {
    return this.http.post<T>(PORT + `/${this.source}/API/` + endpoint, data);
  }

  deleteData(endpoint: string) {
    return this.http.delete<any>(PORT + `/${this.source}/API/` + endpoint);
  }

  putData(endpoint: string, data: FormGroup) {
    return this.http.put<any>(PORT + `/${this.source}/API/` + endpoint, data.getRawValue());
  }

}
