import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma/index.js';
import { Role } from '../types/types.js';

const prisma = new PrismaClient();

export const checkPermissions =
  (requiredPermissions: Role[]) => async (req: Request, res: Response, next: NextFunction) => {
    console.log('Check User Role');
    console.log('requiredPermissions: ', requiredPermissions);
    try {
      const authUser = req.user;

      if (!authUser) {
        return res.status(401).json({
          status: 401,
          error: 'Unauthorized',
          message: 'Token missing or invalid'
        });
      }

      const { email } = authUser as { email: string };
      const userExisting = await prisma.user.findUnique({
        where: { email, isDeleted: false }
      });

      if (!userExisting) {
        return res.status(404).json({
          status: 404,
          error: 'NotFound',
          message: 'User not found'
        });
      }

      const { role } = userExisting;
      console.log('role: ', role);
      if (!requiredPermissions.includes(role as Role)) {
        return res.status(403).json({
          status: 403,
          error: 'Forbidden',
          message: 'Access Denied'
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: 'InternalServerError',
        message: 'Something went wrong'
      });
    }
  };
