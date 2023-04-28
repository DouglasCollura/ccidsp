import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  private url: string = environment.serverUrl;

  login(data:any): Observable<any> {
    return this.http.post(`${this.url}/auth/login`,data)
  }

  signUp(data:any): Observable<any> {
    return this.http.post(`${this.url}/user`,data)
  }
}
