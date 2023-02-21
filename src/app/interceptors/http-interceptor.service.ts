import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const headers =  new HttpHeaders({
      'auth-Token':'ABC1234567890'
    });

    const reqClone = req.clone({
      headers,
    })

    return next.handle(reqClone).pipe(
      catchError( this.errorHandler )
    )
  }


  /**
   * Handles all the errors from http petitions
   */
  errorHandler(error: HttpErrorResponse){

    if(error.status == 404) return throwError(() => new Error(`Not Found Error!`));

    return throwError(() => new Error(`Custom error message ( apply here )`))//${error}

  }
}
