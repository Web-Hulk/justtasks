import { NextFunction, Request, Response } from 'express';
import { permissionsMatrix } from '../config/permissionsMatrix.js';
import { PrismaClient } from '../generated/prisma/index.js';
import { Role } from '../types/types.js';

const prisma = new PrismaClient();

const normalizePath = (path: string) => {
  return path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
};

export const checkPermissions = async (req: Request, res: Response, next: NextFunction) => {
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

    const path = normalizePath(`${req.baseUrl}${req.route.path}`);
    const key = `${req.method}:${path}`;
    const matrixRoles = permissionsMatrix[key];

    if (!matrixRoles || !matrixRoles.includes(role as Role)) {
      console.log(`[AUDIT] Forbidden access: ${email} tried to access ${key}`);
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
