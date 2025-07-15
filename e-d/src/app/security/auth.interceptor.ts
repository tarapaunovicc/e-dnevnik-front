import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, switchMap, take, throwError } from "rxjs";
import { AuthenticationService } from "./authentication.service";

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  private baseUrl = 'http://localhost:8080';

  constructor(private authService: AuthenticationService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    return this.authService.currentUser.pipe(
      take(1), 
      switchMap(user => {
        if (user && user.accessToken) {
          request = request.clone({
            setHeaders: {
              Authorization: "Bearer " + user.accessToken,
            }
          });
        }
        return next.handle(request);
      })
    );
  }
}
  