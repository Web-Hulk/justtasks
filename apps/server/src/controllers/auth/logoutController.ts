import type { Request, Response } from 'express';

export const logoutController = (req: Request, res: Response) => {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0
  });

  return res.status(200).json({
    status: 200,
    message: 'Logged out successfully.'
  });
};
