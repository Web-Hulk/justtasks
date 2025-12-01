import { Request, Response } from 'express';
import { PrismaClient } from '../../../generated/prisma/index.js';

const prisma = new PrismaClient();

export const sessionLogoutAllController = async (req: Request, res: Response) => {
  try {
    const userId = Number((req.user as { id?: string | number })?.id);

    if (!userId) {
      return res.status(401).json({
        status: 401,
        error: 'Unauthorized',
        message: 'User not authenticated'
      });
    }

    const result = await prisma.session.updateMany({
      where: { userId },
      data: { isRevoked: true }
    });

    if (result.count === 0) {
      return res.status(404).json({
        status: 404,
        error: 'NotFound',
        message: 'No sessions found to revoke'
      });
    }

    return res.status(200).json({
      status: 200,
      message: `Revoked ${result.count} session(s) successfully`
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: 'InternalServerError',
      message: 'Something went wrong'
    });
  }
};
