import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvestigatorService {

  constructor(private http: HttpClient) { }
  private url: string = environment.serverUrl;

  getInvestigators(): Observable<any> {
    return this.http.get(`${this.url}/investigator`)
  }

  getStudentByPeopleId(id:number): Observable<any> {
    return this.http.get(`${this.url}/investigator/getByPeopleId/${id}`)
  }

  getInvestigatorList(data:any): Observable<any> {
    return this.http.post(`${this.url}/investigator/list`, data)
  }

  searchInvestigator(data:any): Observable<any> {
    return this.http.post(`${this.url}/investigator/search`, data)
  }


  storeInvestigators(data:any): Observable<any> {
    return this.http.post(`${this.url}/investigator`, data)
  }

  updateInvestigator(id:number,data:any): Observable<any> {
    return this.http.patch(`${this.url}/investigator/${id}`, data)
  }

  deleteInvestigator(id:number): Observable<any> {
    return this.http.delete(`${this.url}/investigator/${id}`)
  }
}
