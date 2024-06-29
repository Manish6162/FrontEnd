import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://todeploywebapi.azurewebsites.net/api/Users/checkOrGenerateUser'; // Corrected API URL

  constructor(private http: HttpClient) {}

  checkAndGenerateUser(metadata: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, metadata).pipe(
      tap((response) => {
        const username = response.username;
        const profilePicUrl = response.profilePicUrl;
        if (username && profilePicUrl) {
          console.log('Generated Username:', username);
        } else {
          console.error('Invalid API response:', response);
        }
      })
    );
  }
}
