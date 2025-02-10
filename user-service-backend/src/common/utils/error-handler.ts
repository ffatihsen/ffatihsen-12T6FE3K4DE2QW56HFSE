import { HttpException, HttpStatus } from '@nestjs/common';

export function handleDatabaseError(error: any) {
  if (error.code === 'ER_DUP_ENTRY') {
    throw new HttpException(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Duplicate entry',
        sqlMessage: error.message,
      },
      HttpStatus.BAD_REQUEST,
    );
  } else if (error.code === 'ER_NO_SUCH_TABLE') {
    throw new HttpException(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Table not found',
        sqlMessage: error.message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  } else if (error.code === 'ER_SYNTAX_ERROR') {
    throw new HttpException(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'SQL Syntax error',
        sqlMessage: error.message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  } else {
    throw new HttpException(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Database error',
        sqlMessage: error.message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
