import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { sendResponse } from '../utils/apiResponse';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('[Error Stack]', err);

  if (err instanceof ApiError) {
    return sendResponse(res, err.statusCode, err.message, null);
  }

  if (err.name === 'ValidationError') {
    return sendResponse(res, 400, 'Database validation failure', err.errors);
  }

  if (err.code === 11000) {
    const keys = Object.keys(err.keyValue || {});
    return sendResponse(res, 409, `Duplicate entry for key: ${keys.join(', ')}`);
  }

  return sendResponse(res, 500, err.message || 'Internal Server Error');
};
