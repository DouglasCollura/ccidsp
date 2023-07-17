import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }
  private url: string = environment.serverUrl;


  getProject(id:number): Observable<any> {
    return this.http.get(`${this.url}/project/${id}`)
  }

  storeProject(data:any): Observable<any> {
    return this.http.post(`${this.url}/project`, data)
  }

  changeStatus(id:number,data:any): Observable<any> {
    return this.http.patch(`${this.url}/project/change-status/${id}`, data)
  }

  update(id:number,data:any): Observable<any> {
    return this.http.patch(`${this.url}/project/update/${id}`, data)
  }

  deletePnf(id:number): Observable<any> {
    return this.http.delete(`${this.url}/pnf/${id}`)
  }
}
