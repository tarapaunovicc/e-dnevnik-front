import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, tap } from "rxjs";
import { AuthResponse } from "../model/AuthResponse";
import { AuthService } from "../service/auth/auth.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CurrentUser } from "../model/CurrentUser";


@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  currentUser = new BehaviorSubject<AuthResponse | null>(null);
  token!: string;
  refreshToken!: string;

  constructor(
    private authApiService: AuthService, // Your HTTP service for making API calls
    private http: HttpClient  // For making the refresh token call
  ) {
    this.token = localStorage.getItem('token') || '';
    this.refreshToken = localStorage.getItem('refreshToken') || '';
    let user = localStorage.getItem('user');
    if (user) {
      this.currentUser.next(JSON.parse(user));
    }
  }

  private setToken(authResponse: AuthResponse): void {
    this.token = authResponse.accessToken;
    this.refreshToken = authResponse.refreshToken;
  }

  private saveInfoToLocalStorage(authResponse: AuthResponse): void {
    localStorage.setItem('token', this.token);
    localStorage.setItem('refreshToken', this.refreshToken);
    localStorage.setItem('user', JSON.stringify(authResponse));
  }

  private removeToken(): void {
    this.token = '';
    this.refreshToken = '';
  }

  private removeTokenFromLocalStorage(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // The new refreshToken$ method
  refreshToken$(): Observable<AuthResponse> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.refreshToken}`);
    
    return this.http.post<AuthResponse>('http://localhost:8080/auth/refreshToken', {}, { headers }).pipe(
      tap((newAuthResponse: AuthResponse) => {
        this.setToken(newAuthResponse);
        this.saveInfoToLocalStorage(newAuthResponse);  // Save the new tokens
        this.currentUser.next(newAuthResponse);
      })
    );
  }

  login$(username: string, password: string): Observable<AuthResponse> {
    return this.authApiService
      .login(username, password).pipe(
        tap((response) => {
          console.log(response);
          this.currentUser.next(response);
          this.setToken(response);
          this.saveInfoToLocalStorage(response);
        })
      );
  }

  logout$(): Observable<void> {
    return this.authApiService
    .logout().pipe(tap(() => {
      this.removeToken();
      this.removeTokenFromLocalStorage();
      this.currentUser.next(null);
    }));
  }

  localLogout(): void {
    this.removeToken();
    this.removeTokenFromLocalStorage();
  }
}
