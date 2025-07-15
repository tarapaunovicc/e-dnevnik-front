import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/model/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly API = "http://localhost:8080";
  

  constructor(private http: HttpClient) {}

  public findAll(): Observable<Array<User>> {
    return this.http.get<Array<User>>(`${this.API}/users`);
  }

  public findById(id: string): Observable<User> {
    return this.http.get<User>(`${this.API}/users/${id}`);
  }

  public save(user: User): Observable<User> {
    return this.http.post<User>(`${this.API}/users`, user);
  }
}
