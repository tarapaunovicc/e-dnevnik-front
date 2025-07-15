import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Student } from 'src/app/model/Student';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StudentService  {
  

  readonly API = "http://localhost:8080";

  constructor(private http: HttpClient) {}

  public findAll(): Observable<Array<Student>> {
    return this.http.get<Array<Student>>(`${this.API}/students`);
  }

  public findById(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.API}/students/${id}`);
  }

  public save(student: Student): Observable<Student> {
    return this.http.post<Student>(`${this.API}/students`, student);
  }

  public findByStudentClass(cl: number) : Observable<Array<Student>> {
    console.log("udje u servis");
    return this.http.get<Array<Student>>(`${this.API}/students/class/${cl}`);
  }
}
