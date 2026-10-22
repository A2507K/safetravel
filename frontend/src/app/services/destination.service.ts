import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Destination {
  _id?: string;
  name: string;
  country: string;
  description: string;
  image: string;
  category?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DestinationService {

  private apiUrl = 'http://localhost:3000/api/destinations';

  constructor(private http: HttpClient) {}

  getDestinations(): Observable<Destination[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response =>
        Array.isArray(response)
          ? response
          : response.destinations ?? []
      )
    );
  }
}