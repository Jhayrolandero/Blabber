import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PORT } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  constructor(private http: HttpClient) {}

   //CRUD requests
   fetchData<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(PORT + '/GC-FaMS-API/API/' + endpoint);
  }

  postData<T>(data: FormData, endpoint: string): Observable<T> {
    return this.http.post<T>(PORT + '/GC-FaMS-API/API/' + endpoint, data);
  }
}
