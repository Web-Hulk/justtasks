import { Request, Response } from 'express';
import { PrismaClient } from '../../../generated/prisma/index.js';

const prisma = new PrismaClient();

export const sessionDeleteController = async (req: Request, res: Response) => {
  try {
    const userId = Number((req.user as { id?: string | number })?.id);
    const { sessionId } = req.params;

    if (!userId) {
      return res.status(401).json({
        status: 401,
        error: 'Unauthorized',
        message: 'User not authenticated'
      });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId }
    });

    if (!session || session.userId !== userId) {
      return res.status(404).json({
        status: 404,
        error: 'NotFound',
        message: 'Session not found or does not belong to user'
      });
    }

    await prisma.session.update({
      where: { id: sessionId },
      data: { isRevoked: true }
    });

    return res.status(200).json({
      status: 200,
      message: 'Session revoked successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: 'InternalServerError',
      message: 'Something went wrong'
    });
  }
};
