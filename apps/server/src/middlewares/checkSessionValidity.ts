import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

// Retrieve sessionId and check if it is valid, if no, return 403
export const checkSessionValidity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId, refreshToken } = req.cookies;
    const userId = Number((req.user as { id?: string | number })?.id);

    if (!sessionId) {
      return res.status(401).json({
        status: 401,
        error: 'Unauthorized',
        message: 'User not authenticated'
      });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId }
    });

    // Session doesn't exists
    if (!session) {
      return res.status(404).json({
        status: 404,
        error: 'NotFound',
        message: 'Session not found'
      });
    }

    // Check session ownership
    if (session.userId !== userId) {
      return res.status(403).json({
        status: 403,
        error: 'Forbidden',
        message: 'Session does not belong to user'
      });
    }

    // Check if session is revoked
    if (!session.isRevoked) {
      return res.status(403).json({
        status: 403,
        error: 'Forbidden',
        message: 'Session is revoked'
      });
    }

    // Check refresh token match
    if (session.refreshToken !== refreshToken) {
      return res.status(403).json({
        status: 403,
        error: 'Forbidden',
        message: 'Refresh token does not match'
      });
    }

    // Check refresh token expiry
    const decodedSessionRefreshToken = jwt.verify(
      session.refreshToken,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    if (!decodedSessionRefreshToken?.exp || decodedSessionRefreshToken.exp < new Date().getTime()) {
      return res.status(403).json({
        status: 403,
        error: 'Forbidden',
        message: 'Refresh token expired or invalid'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: 'InternalServerError',
      message: 'Something went wrong'
    });
  }
};
