import { Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

export const meController = async (req: Request, res: Response) => {
  try {
    const decoded = req.user;

    if (!decoded) {
      return res.status(401).json({
        status: 401,
        error: 'Unauthorized',
        message: 'Token missing or invalid'
      });
    }

    const { email } = decoded as { email: string };
    const userData = await prisma.user.findUnique({
      where: { email, isDeleted: false }
    });

    if (!userData || userData.isDeleted) {
      return res.status(404).json({
        status: 404,
        error: 'NotFound',
        message: 'User not found'
      });
    }

    const { password, ...safeUserData } = userData;

    return res.status(200).json({
      status: 200,
      data: safeUserData
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: 'InternalServerError',
      message: 'Something went wrong'
    });
  }
};
