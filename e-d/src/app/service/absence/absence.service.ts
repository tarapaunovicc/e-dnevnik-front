import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Absence, AbsencePK } from 'src/app/model/Absence';

@Injectable({
  providedIn: 'root'
})
export class AbsenceService {

  readonly API = "http://localhost:8080";

  constructor(private http:HttpClient) { }

  public findAll(): Observable<Array<Absence>> {
    return this.http.get<Array<Absence>>(`${this.API}/absences`);
  }

  public findById(id: AbsencePK): Observable<Absence> {
    return this.http.get<Absence>(`${this.API}/absences/${id}`);
  }

  public save(absence: Absence): Observable<Absence> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Absence>(`${this.API}/absences/new`, absence, {headers});
  }

  public findByStudentUsername(username:String): Observable<Array<Absence>>{
    return this.http.get<Array<Absence>>(`${this.API}/absences/all/${username}`);
  }

  //fali update
  public updateAbsences(absence: Absence): Observable<Absence> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Absence>(`${this.API}/absences/modify`,absence,{headers});
}
  
}
