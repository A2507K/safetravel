import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface AdminUsersResponse {
  success: boolean;
  count: number;
  users: AdminUser[];
}

export interface AdminDestination {
  _id?: string;
  name: string;
  country: string;
  description: string;
  image: string;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminDestinationsResponse {
  success: boolean;
  count: number;
  destinations: AdminDestination[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
private apiUrl = 'https://safetravel-duau.onrender.com/api/admin';
  constructor(private http: HttpClient) {}

  // Authentication headers
  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('safetravel_token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Load users
  getUsers(): Observable<AdminUsersResponse> {
    return this.http.get<AdminUsersResponse>(
      `${this.apiUrl}/users`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Load destinations
  getDestinations(): Observable<AdminDestinationsResponse> {
    return this.http.get<AdminDestinationsResponse>(
      `${this.apiUrl}/destinations`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Add a destination
  addDestination(
    destination: AdminDestination
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/destinations`,
      destination,
      { headers: this.getAuthHeaders() }
    );
  }

  // Update an existing destination
  updateDestination(
    id: string,
    destination: AdminDestination
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/destinations/${id}`,
      destination,
      { headers: this.getAuthHeaders() }
    );
  }

  // Delete a destination
  deleteDestination(id: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/destinations/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }
}
