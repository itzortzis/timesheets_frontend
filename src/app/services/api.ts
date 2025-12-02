import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface PostResponse {
  status: string;
  message: string;
  filepath: string;
}

@Injectable({
  providedIn: 'root'
})
export class Api {
  
  constructor(private http: HttpClient) { }

  /**
   * Sends a POST request with JSON data to the specified endpoint.
   * @param url The target URL for the POST request.
   * @param payload The data object to be sent as the JSON body.
   * @returns An Observable of the expected response type.
   */
  postJsonData(url: string, payload: any): Observable<PostResponse> {
    
    
    const headers = new HttpHeaders({
      // Example of a custom header you might need:
      // 'Authorization': 'Bearer YOUR_TOKEN' 
    });

    
    return this.http.post<PostResponse>(
      url, 
      payload, 
      { headers: headers }
    );
  }

  downloadCsv(url: string, payload: any): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.post(
      url, 
      payload, 
      { 
        headers: headers,
        responseType: 'blob'
      }
    );
  }
}