import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

export const authorizeToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    console.log('authHeader: ', authHeader);
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Token: ', token);

    if (!token) {
      return res.status(401).json({
        status: 401,
        error: 'Unauthorized',
        message: 'Token missing or invalid'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    console.log('Decoded: ', decoded);

    next();
  } catch (error) {
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
      message: 'Token missing or invalid'
    });
  }
};
