import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  constructor(private http: HttpClient) { }
  private url: string = environment.serverUrl;

  getTeachers(): Observable<any> {
    return this.http.get(`${this.url}/teacher`)
  }

  storeTeacher(data:any): Observable<any> {
    return this.http.post(`${this.url}/teacher`, data)
  }
}
