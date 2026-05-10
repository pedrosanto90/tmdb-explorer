import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, throwError } from 'rxjs';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  const clonedRequest = req.clone({
    params: req.params.set('api_key', environment.tmdbApiKey),
  });
  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      let userMessage = 'An error has occurred';

      switch (error.status) {
        case 0:
          userMessage = 'No internet connection. Check your internet connection.';
          break;
        case 401:
          userMessage = 'Invalid API Key. Check your configs.';
          break;
        case 404:
          userMessage = 'Resource not found.';
          break;
        case 429:
          userMessage = 'To many requests. Try again later.';
          break;
        case 500:
        case 502:
        case 503:
          userMessage = 'Server Error. Try again later.';
          break;
      }
      if (!environment.production) {
        console.error('[HTTP Error]', {
          status: error.status,
          url: error.url,
          message: userMessage,
        });
      }
      return throwError(() => new Error(userMessage));
    }),
  );
};
