import { Request, Response } from 'express';
import { PrismaClient } from '../../../generated/prisma/index.js';

const prisma = new PrismaClient();

export const sessionsController = async (req: Request, res: Response) => {
  try {
    // Ugly, will be fixed
    const userId = Number((req.user as { id?: string | number })?.id);

    if (!userId) {
      return res.status(401).json({
        status: 401,
        error: 'Unauthorized',
        message: 'User not authenticated'
      });
    }

    const sessions = await prisma.session.findMany({
      where: { userId },
      orderBy: { lastUsedAt: 'desc' }
    });

    return res.status(200).json({
      status: 200,
      results: sessions.length,
      data: sessions
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: 'InternalServerError',
      message: 'Something went wrong'
    });
  }
};
