import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Subject } from 'src/app/model/Subject';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SubjectService extends HttpClient{

  readonly API = "http://localhost:8080";

  constructor(handler:HttpHandler) {super(handler) }

  public findAll(): Observable<Array<Subject>> {
    return this.get<Array<Subject>>(`${this.API}/subjects`);
  }

  public findById(id: number): Observable<Subject> {
    return this.get<Subject>(`${this.API}/subjects/${id}`);
  }

  public save(subject: Subject): Observable<Subject> {
    return this.post<Subject>(`${this.API}/users`, subject);
  }
}
