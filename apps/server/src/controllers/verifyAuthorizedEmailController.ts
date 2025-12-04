import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

export const verifyAuthorizedEmailController = async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({
      status: 400,
      error: 'TokenMissing',
      message: 'No token provided'
    });
  }

  const user = await prisma.user.findFirst({
    where: { pendingEmailToken: token }
  });

  if (
    !user ||
    !user.pendingEmail ||
    !user.pendingEmailExpires ||
    new Date() > user.pendingEmailExpires
  ) {
    return res.status(400).json({
      status: 400,
      error: 'TokenInvalidOrExpired',
      message: 'Token is invalid or expired'
    });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      email: user.pendingEmail,
      isActivated: true,
      pendingEmailToken: null,
      pendingEmailExpires: null
    }
  });

  return res.redirect('http://localhost:5173/login');
};
