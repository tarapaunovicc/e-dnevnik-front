import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Class } from 'src/app/model/Class';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ClassService extends HttpClient {
  
  readonly API = "http://localhost:8080";

  constructor(handler: HttpHandler) {super(handler); }

  public findAll(): Observable<Array<Class>> {
    return this.get<Array<Class>>(`${this.API}/classes`);
  }

  public findById(id: number): Observable<Class> {
    return this.get<Class>(`${this.API}/classes/${id}`);
  }

  public save(cl: Class): Observable<Class> {
    return this.post<Class>(`${this.API}/classes`, cl);
  }

  public findByTeacherUsername(username: string): Observable<Class> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.get<Class>(`${this.API}/classes/find/${username}`,{headers});
  }

}
