import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    let message = exception.message;

    let errorDetails: { error: string }[] = [];

    if (status === 400 && exception.getResponse() && (exception.getResponse() as any).message) {
      const validationErrors = (exception.getResponse() as any).message;

      if (Array.isArray(validationErrors)) {
        validationErrors.forEach((error: string) => {
          errorDetails.push({ error: error });
        });
      }
    }

    
    if (exception.message.includes('Duplicate entry')) {
      response.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
        sqlMessage: exception.message,
      });
      return;
    }

    if (status === 500) {
      response.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
      });
      return;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: status === 400 ? 'Validation failed' : message,
      errors: errorDetails.length ? errorDetails : [],
    });
  }
}
