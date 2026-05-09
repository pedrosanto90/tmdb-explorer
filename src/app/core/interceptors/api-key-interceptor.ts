import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  const clonedRequest = req.clone({
    params: req.params.set('api_key', environment.tmdbApiKey),
  });
  return next(clonedRequest);
};
