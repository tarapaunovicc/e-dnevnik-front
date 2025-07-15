import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Lesson, LessonPK } from 'src/app/model/Lesson';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LessonService {

  readonly API = "http://localhost:8080";

  constructor(private http:HttpClient) { }

  public findAll(): Observable<Array<Lesson>> {
    return this.http.get<Array<Lesson>>(`${this.API}/lessons`);
  }

  public findById(id: LessonPK): Observable<Lesson> {
    return this.http.get<Lesson>(`${this.API}/lessons/${id}`);
  }

  public save(lesson: Lesson): Observable<Lesson> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Lesson>(`${this.API}/lessons/new`, lesson, { headers });
  }
  

  
}
