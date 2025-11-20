import type { Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

export const verifyEmailController = async (req: Request, res: Response) => {
  console.log('Verify Email Endpoint!');

  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({
      status: 400,
      error: 'TokenMissing',
      message: 'No token provided'
    });
  }

  const user = await prisma.user.findFirst({
    where: { activationToken: token }
  });

  if (!user || !user.activationExpires || new Date() > user.activationExpires) {
    return res.status(400).json({
      status: 400,
      error: 'TokenInvalidOrExpired',
      message: 'Token is invalid or expired'
    });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isActivated: true,
      activationToken: null,
      activationExpires: null
    }
  });

  return res.redirect('http://localhost:5173/login');
};
