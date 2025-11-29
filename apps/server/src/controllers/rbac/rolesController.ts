import { Request, Response } from 'express';
import { Role } from '../../types/types.js';

export const rolesController = (req: Request, res: Response) => {
  return res.status(200).json({
    status: 200,
    data: {
      user: Role.USER,
      admin: Role.ADMIN
    }
  });
};
