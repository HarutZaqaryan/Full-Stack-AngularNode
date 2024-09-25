import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, throwError } from 'rxjs';
import { ErrorComponent } from '../Components/error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        let errorMessage: string = 'An error occured';
     
        console.log('errerrerrerr',err);
        
     
        if (err.error.message) {
          errorMessage = err.error.message;
        }

        console.log('errormessage',errorMessage)

        this.dialog.open(ErrorComponent, {
          data: {
            message: errorMessage,
          },
        });

        return throwError(err);
      })
    );
  }
}
