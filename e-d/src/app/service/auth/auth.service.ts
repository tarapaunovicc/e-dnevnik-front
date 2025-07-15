import { HttpClient, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthResponse } from 'src/app/model/AuthResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends HttpClient {

  private baseUrl = 'http://localhost:8080';
  constructor(handler: HttpHandler) {
    super(handler);
  }

  
  public login(username: string, password: string) : Observable<AuthResponse>{
    return this.post<AuthResponse>(`${this.baseUrl}/auth/authenticate`, { username, password });
  }

  public logout(): Observable<any> {
    return this.get(`${this.baseUrl}/auth/logout`, {});
  }
}
