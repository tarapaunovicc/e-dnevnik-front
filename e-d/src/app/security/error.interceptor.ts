import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "./authentication.service";
import { catchError, Observable, throwError } from "rxjs";

@Injectable({
    providedIn: 'root',
  })
  export class ErrorInterceptor implements HttpInterceptor {
    private baseUrl = 'http://localhost:8080';
    constructor(
      private authService: AuthenticationService
    ) { }
  
  
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
      if (!request.url.startsWith(this.baseUrl)) {
        return next.handle(request);
      }
  
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.authService.localLogout();
          }
  
          const errorMessages: string = error.error.errorMessages?.flat().join(', ');
  
          return throwError(() => error);
        }),
      );
    }
  }