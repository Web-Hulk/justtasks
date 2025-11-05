import type { Request, Response } from "express";

export const profileController = async (req: Request, res: Response) => {
  res.status(200).json({
    status: 200,
    message: 'Profile endpoint correct setup',
  });
}