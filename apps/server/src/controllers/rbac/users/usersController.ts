import { Request, Response } from 'express';
import { PrismaClient } from '../../../generated/prisma/index.js';

const prisma = new PrismaClient();

export const usersController = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        isDeleted: true,
        isActivated: true
      }
    });

    return res.status(200).json({
      status: 200,
      data: users
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: 'InternalServerError',
      message: 'Something went wrong'
    });
  }
};
