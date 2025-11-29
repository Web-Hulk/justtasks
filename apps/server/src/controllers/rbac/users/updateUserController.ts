import { Request, Response } from 'express';
import { treeifyError, z } from 'zod';
import { PrismaClient } from '../../../generated/prisma/index.js';
import { Role } from '../../../types/types.js';

const prisma = new PrismaClient();

const updateRoleSchema = z.strictObject({
  // Docs says this is also valid
  // role: z.enum(Role)
  role: z.enum([Role.ADMIN, Role.USER])
});

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const validationResult = updateRoleSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        status: 400,
        error: 'ValidationError',
        message: 'Invalid input error',
        details: treeifyError(validationResult.error)
      });
    }

    const { role } = validationResult.data;

    if (!id || isNaN(id)) {
      return res.status(404).json({
        status: 404,
        error: 'NotFound',
        message: 'User not found'
      });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role }
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
      message: 'User successfully updated'
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: 'InternalServerError',
      message: 'Something went wrong'
    });
  }
};
