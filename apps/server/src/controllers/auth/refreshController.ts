import type { Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

export const refreshController = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
      message: 'No refresh token provided. Please log in again.'
    });
  }

  try {
    const { sessionId } = req.cookies;

    if (!sessionId) {
      return res.status(401).json({
        status: 401,
        error: 'Unauthorized',
        message: 'User not authorized'
      });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId }
    });

    if (!session) {
      return res.status(404).json({
        status: 404,
        error: 'NotFound',
        message: 'User not found'
      });
    }

    const decodedSessionRefreshToken = jwt.verify(
      session.refreshToken,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    if (
      session.isRevoked ||
      session.refreshToken !== refreshToken ||
      !decodedSessionRefreshToken?.exp ||
      decodedSessionRefreshToken?.exp < Math.floor(Date.now() / 1000)
    ) {
      return res.status(403).json({
        status: 403,
        error: 'Forbidden',
        message: 'Refresh token expired or invalid'
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET as string) as JwtPayload;

    const accessToken = jwt.sign(
      { id: decoded?.id, email: decoded?.email },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '15s'
      }
    );
    const newRefreshToken = jwt.sign(
      { id: decoded?.id, email: decoded?.email },
      process.env.JWT_SECRET as string,
      {
        expiresIn: decoded?.rememberMe ? '180s' : '60s'
      }
    );

    await prisma.session.update({
      where: { id: sessionId },
      data: { refreshToken: newRefreshToken }
    });

    res.cookie('sessionId', session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: decoded?.rememberMe ? 180 * 1000 : 60 * 1000
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
