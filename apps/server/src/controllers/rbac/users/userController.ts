import { Request, Response } from 'express';
import { PrismaClient } from '../../../generated/prisma/index.js';

const prisma = new PrismaClient();

export const userController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(404).json({
        status: 404,
        error: 'NotFound',
        message: 'User not found'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id, isDeleted: false },
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

    if (!user) {
      return res.status(404).json({
        status: 404,
        error: 'NotFound',
        message: 'User not found'
      });
    }

    return res.status(200).json({
      status: 200,
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: 'InternalServerError',
      message: 'Something went wrong'
    });
  }
};
