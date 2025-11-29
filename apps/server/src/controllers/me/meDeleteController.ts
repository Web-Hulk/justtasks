import { Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

export const meDeleteController = async (req: Request, res: Response) => {
  try {
    const decoded = req.user;

    if (!decoded) {
      // Audit log: failed deletion due to missing token
      console.log(`[AUDIT] Deletion attempt failed: missing or invalid token`);
      return res.status(401).json({
        status: 401,
        error: 'Unauthorized',
        message: 'Token missing or invalid'
      });
    }

    const { email } = decoded as { email: string };

    // Fetch user from DB
    const user = await prisma.user.findUnique({ where: { email, isDeleted: false } });

    if (!user || user.isDeleted) {
      // Audit log: failed deletion due to user not found or already deleted
      console.log(
        `[AUDIT] Deletion attempt failed for email: ${email} (user not found or already deleted)`
      );
      return res.status(404).json({
        status: 404,
        error: 'NotFound',
        message: 'User not found'
      });
    }

    await prisma.user.update({
      where: { email },
      data: { isDeleted: true }
    });

    // Audit log: successful deletion
    console.log(`[AUDIT] User deleted: ${email}`);

    return res.status(200).json({
      status: 200,
      message: 'User successfully deleted'
    });
  } catch (error) {
    // Audit log: internal error
    console.log(`[AUDIT] Internal error during deletion: ${error}`);
    return res.status(500).json({
      status: 500,
      error: 'InternalServerError',
      message: 'Something went wrong'
    });
  }
};
