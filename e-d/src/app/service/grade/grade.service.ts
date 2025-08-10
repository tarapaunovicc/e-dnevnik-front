import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Grade, GradePK } from 'src/app/model/Grade';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GradeService extends HttpClient{
 

  readonly API = "http://localhost:8080";

  constructor(handler:HttpHandler) {super(handler); }

  public findAll(): Observable<Array<Grade>> {
    return this.get<Array<Grade>>(`${this.API}/grades`);
  }

  public findById(id: GradePK): Observable<Grade> {
    return this.get<Grade>(`${this.API}/grades/${id}`);
  }

  public save(grade: Grade): Observable<Grade> {
    console.log(grade);
    return this.post<Grade>(`${this.API}/grades`, grade);
  }

  public findByStudentUsername(username: string) :Observable<Array<Grade>> {
    return this.get<Array<Grade>>(`${this.API}/grades/student/${username}`);
  }

  public getGradesByStudentAndTeacher(studentUsername: string, teacherUsername: string): Observable<Grade[]> {
  const payload = {
    studentusername: studentUsername,
    teacherusername: teacherUsername
  };
  console.log(teacherUsername);
  return this.post<Grade[]>(`${this.API}/grades/by-student-teacher`, payload);
  }
}
