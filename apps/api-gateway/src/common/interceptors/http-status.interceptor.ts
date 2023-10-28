import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

export interface Response<T> {
  data: T;
}

@Injectable()
export class HttpStatusInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();

        if (response.sent) {
          return;
        }

        response.status(data.status);

        if (response.getHeaders()['content-type'] === 'text/html') {
          // Required for the embedded JS to work
          response.header('Content-Security-Policy', 'self');

          return data.html;
        }

        return data;
      }),
    );
  }
}
