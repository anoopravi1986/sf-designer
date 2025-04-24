import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageGeneratorService {
    private apiKey = 'AIzaSyD0fbMKErb6mstak1yIiHKPPDGwGHMpzNs'; // Replace this
    // private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent';
    private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-04-17:generateContent'

  constructor(private http: HttpClient) {}
  generateContent(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
  
      const body = {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      };
  
      return this.http.post(`${this.apiUrl}?key=${this.apiKey}`, body, { headers });
  }
}





