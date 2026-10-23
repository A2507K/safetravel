import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SafetyService {

private apiUrl = 'https://safetravel-duau.onrender.com';
  constructor(private http: HttpClient) {}

  checkSafety(destination: string) {
    const token = sessionStorage.getItem('safetravel_token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token || ''}`
    });

    return this.http.get(
      `${this.apiUrl}/api/safety/${encodeURIComponent(destination)}`,
      { headers }
    );
  }
}
