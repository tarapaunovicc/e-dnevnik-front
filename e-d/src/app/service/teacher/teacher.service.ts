import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Teacher } from 'src/app/model/Teacher';
import { TeachersClasses } from 'src/app/model/TeachersClasses';


@Injectable({
  providedIn: 'root'
})
export class TeacherService extends HttpClient {
  

  readonly API = "http://localhost:8080";

  constructor(handler: HttpHandler) {super(handler) }

  public findAll(): Observable<Array<Teacher>> {
    return this.get<Array<Teacher>>(`${this.API}/users`);
  }

  public findById(id: string): Observable<Teacher> {
    return this.get<Teacher>(`${this.API}/teachers/${id}`);
  }

  public save(teacher: Teacher): Observable<Teacher> {
    return this.post<Teacher>(`${this.API}/users`, teacher);
  }

  public getClasses(username: string) : Observable<TeachersClasses[]>{
    
    return this.get<Array<TeachersClasses>>(`${this.API}/teachers/${username}/classes`);
  }
}
