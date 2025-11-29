import { Request, Response } from 'express';
import { PrismaClient } from '../../../generated/prisma/index.js';
import { Role } from '../../../types/types.js';

const prisma = new PrismaClient();

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const userExisting = await prisma.user.findUnique({
      where: { id, isDeleted: false }
    });

    if (!id || isNaN(id) || !userExisting) {
      return res.status(404).json({
        status: 404,
        error: 'NotFound',
        message: 'User not found'
      });
    }

    // Add check if admin tries to delete himself
    await prisma.user.update({
      where: { id, isDeleted: false, role: Role.USER },
      data: { isDeleted: true }
    });

    return res.status(200).json({
      status: 200,
      message: 'User successfully deleted'
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: 'InternalServerError',
      message: 'Something went wrong'
    });
  }
};
