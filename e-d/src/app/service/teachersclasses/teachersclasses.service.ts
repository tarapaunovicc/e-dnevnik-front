import { HttpClient, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TeachersClasses, TeachersClassesPK } from 'src/app/model/TeachersClasses';

@Injectable({
  providedIn: 'root'
})
export class TeachersclassesService {
 
  

  readonly API = "http://localhost:8080";

  constructor(private http: HttpClient) {
    
  }

  public findAll(): Observable<Array<TeachersClasses>> {
    return this.http.get<Array<TeachersClasses>>(`${this.API}/teachersclasses`);
  }

  // public findById(id: TeachersClassesPK): Observable<TeachersClasses> {
  //   return this.get<TeachersClasses>(`${this.API}/teachersclasses/${id}`);
  // }

  public findByTeacherUsername(username: string): Observable<TeachersClasses[]> {
    console.log(this.http.get<TeachersClasses[]>(`${this.API}/teachersclasses/${username}`));
    return this.http.get<TeachersClasses[]>(`${this.API}/teachersclasses/${username}`)
  }
  
  
}
