import type { Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

export const refreshController = (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
      message: 'No refresh token provided. Please log in again.'
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET as string) as JwtPayload;

    const accessToken = jwt.sign({ id: decoded?.id, email: decoded?.email }, process.env.JWT_SECRET as string, {
      expiresIn: '15s'
    });
    const newRefreshToken = jwt.sign({ id: decoded?.id, email: decoded?.email }, process.env.JWT_SECRET as string, {
      expiresIn: decoded?.rememberMe ? '180s' : '60s'
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: decoded?.rememberMe ? 180 * 1000 : 60 * 1000
    });

    return res.status(200).json({
      status: 200,
      accessToken
    });
  } catch (error) {
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
      message: 'Your session has expired or is invalid. Please log in again.'
    });
  }
};
